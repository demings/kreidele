import { Guess } from "../../shared/types";
import { Avatar } from "./Avatar";

export function GuessGroup({ guesses }: { guesses: Guess[] }) {
  return (
    <div className="flex items-end">
      <div className="flex flex-col space-y-0.5 text-xs max-w-xs mx-2 order-2 items-start">
        {guesses.map((guess) => (
          <div key={guess.id}>
            <span
              className={`px-4 py-2 rounded inline-block bg-white text-gray-600 border ${
                guess === guesses[0] ? "rounded-t-lg" : ""
              } ${
                guess === guesses[guesses.length - 1] ? "rounded-b-lg" : ""
              } ${guess.correct ? "border-emerald-300" : ""}`}
            >
              {guess.text}
            </span>
          </div>
        ))}
      </div>
      <Avatar
        avatarUrl={guesses[0].avatarUrl}
        username={guesses[0].username}
        size={32}
        drawing={false}
      />
    </div>
  );
}
