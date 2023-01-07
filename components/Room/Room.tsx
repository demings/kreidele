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
import { Canvas } from "./Canvas/Canvas";
import { ChatHistory } from "./ChatHistory";
import { GuessInput } from "./GuessInput";
import { LiveAvatars } from "./LiveAvatars";

export function Room({ hostId }: { hostId: string }) {
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

  useEventListener(({ event }) => {
    console.log({ event });

    if ((event as any).type === EventType.Message) {
      setMessages((messages) => [...messages, (event as any).message]);
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
          currentWord: randomWords(1)[0],
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
          <div className="col-span-2 rounded-t-md bg-slate-100 w-96 max-h-60 overflow-y-scroll">
            <ChatHistory messages={messages} />
          </div>
          <div className="bg-white  border-b">
            <LiveAvatars
              currentUser={currentUser}
              others={others}
              drawerId={gameState?.drawerId}
            />
          </div>
          <Canvas messages={messages} currentWord={gameState?.currentWord} />
          <div className="border-t">
            <GuessInput setMessages={setMessages} />
          </div>
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
