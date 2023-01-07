import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { Guess } from "../../shared/types";
import { GuessGroup } from "./GuessGroup";

export function GuessHistory({ guesses }: { guesses: Guess[] }) {
  const bottomRef = useRef();

  useEffect(() => {
    // 👇️ scroll to bottom every time guesses change
    (bottomRef.current as any)?.scrollIntoView({ behavior: "smooth" });
  }, [guesses]);

  const groupedGuesses = guesses.reduce((accumulator, current) => {
    if (accumulator.length === 0) {
      return [[current]];
    }

    if (
      accumulator[accumulator.length - 1][0].avatarUrl === current.avatarUrl
    ) {
      accumulator[accumulator.length - 1].push(current);
      return accumulator;
    }

    return [...accumulator, [current]];
  }, [] as Guess[][]);

  return (
    <div className="flex-1 px-4 pt-2 justify-between flex flex-col">
      <div
        id="guesses"
        className="flex flex-col space-y-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {groupedGuesses.map((group) => (
          <GuessGroup guesses={group} key={nanoid()} />
        ))}
        <div ref={bottomRef as never} />
      </div>
    </div>
  );
}
