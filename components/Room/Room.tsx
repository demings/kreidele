import randomWords from "random-words";
import { useEffect, useState } from "react";
import {
  useBroadcastEvent,
  useEventListener,
  useOthersMapped,
  UserMeta,
  UsersMapped,
  useSelf,
} from "../../liveblocks.config";
import { EventType, GameState, Message } from "../../shared/types";
import { processString } from "../../shared/utils";
import { Canvas } from "./Canvas/Canvas";
import { ChatHistory } from "./ChatHistory";
import { GuessInput } from "./GuessInput";
import { LiveAvatars } from "./LiveAvatars";

export function Room({ hostId }: { hostId: string }) {
  const [currentWord, setCurrentWord] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [gameState, setGameState] = useState<GameState>();

  //
  // RATIONALE:
  // Using useOthersMapped here and only selecting/subscribing to the "info"
  // part of each user, which is static data that won't change (unlike
  // presence). In this example we don't use presence, but in a real app this
  // makes a difference: if we did not use a selector function here, these
  // avatars would get needlessly re-rendered any time any of the others moved
  // their cursors :)
  //
  const others = useOthersMapped((other) => other.info) as never as UsersMapped;
  const currentUser = useSelf((self) => self.info) as UserMeta;
  const broadcast = useBroadcastEvent();

  const drawingEnabled = gameState?.drawerId === currentUser.avatarUrl;

  useEventListener(({ event }) => {
    console.log({ event });

    const setNewDrawer = () => {
      if (gameState) {
        setGameState({
          ...gameState,
          drawerId: sample(
            gameState.players.filter(
              (player) => player.id !== gameState.drawerId
            )
          ).id,
        });
      }
    };

    if ((event as any).type === EventType.Message) {
      let message = (event as any).message as Message;

      if (
        drawingEnabled &&
        currentWord &&
        processString(currentWord) === processString(message.text)
      ) {
        message.correct = true;
        console.log("Broadcasting correct", message);
        broadcast({
          type: EventType.GuessIsCorrect,
          message,
        } as never);
        setNewDrawer();
      }

      setMessages((messages) => [...messages, message]);
    }

    if ((event as any).type === EventType.GuessIsCorrect) {
      setMessages((messages) => {
        const message = messages.find(
          (x) => x.id === (event as any).message.id
        );
        if (message) {
          message.correct = true;
        }
        return messages;
      });

      if (isHost(currentUser, hostId)) {
        setNewDrawer();
      }
    }

    if ((event as any).type === EventType.GameStateUpdate) {
      setGameState((event as any).gameState);
    }
  });

  // initialize game state
  useEffect(() => {
    if (isHost(currentUser, hostId)) {
      if (!gameState) {
        setGameState({
          drawerId: sample(others)[1].avatarUrl,
          players: others
            .map((other) => ({
              id: other[1].avatarUrl,
              score: 0,
            }))
            .concat({
              id: currentUser.avatarUrl,
              score: 0,
            }),
        });
      }
    }
  }, []);

  // react to player change
  useEffect(() => {
    if (isHost(currentUser, hostId) && gameState) {
      setGameState({
        ...gameState,
        players: others
          .map((other) => ({
            id: other[1].avatarUrl,
            score:
              gameState.players.find((p) => p.id === other[1].avatarUrl)
                ?.score ?? 0,
          }))
          .concat({
            id: currentUser.avatarUrl,
            score:
              gameState.players.find((p) => p.id === currentUser.avatarUrl)
                ?.score ?? 0,
          }),
      });
    }
  }, [others]);

  // react to drawer change
  useEffect(() => {
    if (gameState?.drawerId === currentUser.avatarUrl) {
      if (!currentWord) {
        setCurrentWord(randomWords(1)[0]);
      }
    } else {
      setCurrentWord(undefined);
    }
  }, [gameState?.drawerId]);

  // broadcast game state
  useEffect(() => {
    if (isHost(currentUser, hostId) && gameState) {
      console.log("Broadcasting", gameState);

      broadcast({
        type: EventType.GameStateUpdate,
        gameState,
      } as never);
    }
  }, [gameState]);

  return (
    <div className="flex justify-center">
      <div className="grid h-screen place-items-center">
        <div className="w-96 shadow-md grid grid-rows-flow grid-cols-1">
          {messages.length > 0 && (
            <div className="col-span-2 rounded-t-md bg-slate-100 w-96 max-h-60 overflow-y-scroll">
              <ChatHistory messages={messages} />
            </div>
          )}
          <div
            className={`bg-white  border-b ${
              messages.length === 0 ? "rounded-t-md" : ""
            }`}
          >
            <LiveAvatars
              currentUser={currentUser}
              others={others}
              drawerId={gameState?.drawerId}
            />
          </div>
          <div className="col-span-2 row-span-2">
            <Canvas
              messages={messages}
              currentWord={currentWord}
              drawingEnabled={drawingEnabled}
            />
          </div>
          {!drawingEnabled && <GuessInput setMessages={setMessages} />}
        </div>
      </div>
    </div>
  );
}

function isHost(user: UserMeta, hostId: string) {
  return user.avatarUrl === hostId;
}

function sample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
