import { useRouter } from "next/router";
import randomWords from "random-words";
import { useEffect, useRef, useState } from "react";
import useDeleteAllLayers from "../../hooks/useDeleteAllLayers";
import {
  useBroadcastEvent,
  useEventListener,
  useOthersMapped,
  UserMeta,
  UsersMapped,
  useSelf,
} from "../../liveblocks.config";
import { EventType, GameState, Guess } from "../../shared/types";
import { processString } from "../../shared/utils";
import { Canvas } from "./Canvas/Canvas";
import { CurrentWord } from "./Canvas/CurrentWord";
import { GuessHistory } from "./GuessHistory";
import { GuessInput } from "./GuessInput";
import { LiveAvatars } from "./LiveAvatars";

export function Room({ id: roomId, hostId }: { id: string; hostId: string }) {
  const [currentWord, setCurrentWord] = useState<string>();
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<GameState>();
  const [allPlayers, setAllPlayers] = useState<UserMeta[]>();

  const allPlayersRef = useRef(allPlayers);
  allPlayersRef.current = allPlayers;

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
  const deleteAllLayers = useDeleteAllLayers();
  const router = useRouter();

  const drawingEnabled = gameState?.drawerId === currentUser.avatarUrl;

  useEffect(() => {
    setAllPlayers(others.map((o) => o[1]).concat(currentUser));
  }, [others, currentUser]);

  useEventListener(({ event }) => {
    console.log({ event });

    const setNewDrawer = () => {
      deleteAllLayers();

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

    if ((event as any).type === EventType.Guess) {
      let guess = (event as any).guess as Guess;

      if (
        drawingEnabled &&
        currentWord &&
        processString(currentWord) === processString(guess.text)
      ) {
        guess.correct = true;
        console.log("Broadcasting correct", guess);
        broadcast({
          type: EventType.GuessIsCorrect,
          guess,
        } as never);
        setNewDrawer();
      }

      setGuesses((guesses) => [...guesses, guess]);
    }

    if ((event as any).type === EventType.GuessIsCorrect) {
      setGuesses((guesses) => {
        const guess = guesses.find((x) => x.id === (event as any).guess.id);
        if (guess) {
          guess.correct = true;
        }
        return guesses;
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
    if (isHost(currentUser, hostId) && allPlayers) {
      if (!gameState) {
        setGameState({
          drawerId: sample(allPlayers).avatarUrl,
          players: allPlayers.map((player) => ({
            id: player.avatarUrl,
            score: 0,
          })),
        });
      }
    }
  }, [allPlayers]);

  // react to player change
  useEffect(() => {
    if (allPlayers) {
      if (isHost(currentUser, hostId)) {
        if (gameState)
          setGameState({
            ...gameState,
            players: allPlayers.map((player) => ({
              id: player.avatarUrl,
              score:
                gameState.players.find((p) => p.id === player.avatarUrl)
                  ?.score ?? 0,
            })),
          });
      } else {
        console.log("Someone left/joined");
        // check if host left after 5s (maybe just refreshing?)
        setTimeout(() => {
          if (
            allPlayersRef.current &&
            !allPlayersRef.current.some((player) => player.avatarUrl === hostId)
          ) {
            console.log("Host left. Deleting room...");
            fetch(`/api/room/${roomId}`, {
              method: "DELETE",
            }).then(() => router.push(`/`));
          }
        }, 5000);
      }
    }
  }, [allPlayers]);

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
          {guesses.length > 0 && (
            <div className="col-span-2 rounded-t-md bg-slate-100 w-96 max-h-60 overflow-y-scroll">
              <GuessHistory guesses={guesses} />
            </div>
          )}
          <div
            className={`bg-white  border-b ${
              guesses.length === 0 ? "rounded-t-md" : ""
            }`}
          >
            <LiveAvatars
              currentUser={currentUser}
              others={others}
              drawerId={gameState?.drawerId}
            />
          </div>
          {currentWord && (
            <div className="col-span-2 row-span-2">
              <CurrentWord word={currentWord} />
            </div>
          )}
          <div className="col-span-2 row-span-2">
            <Canvas
              guesses={guesses}
              drawingEnabled={drawingEnabled}
              currentWord={currentWord}
            />
          </div>
          {!drawingEnabled && <GuessInput setGuesses={setGuesses} />}
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
