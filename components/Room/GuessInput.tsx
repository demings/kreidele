import { Dispatch, SetStateAction, useState } from "react";
import { useBroadcastEvent, useSelf } from "../../liveblocks.config";
import { EventType, Message, UserInfoCookie } from "../../shared/types";

interface GuessInputProps {
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export function GuessInput({ setMessages }: GuessInputProps) {
  const [inputValue, setInputValue] = useState("");

  const broadcast = useBroadcastEvent();

  const currentUser = useSelf();
  const { avatarUrl, username } = currentUser.info as any as UserInfoCookie;

  return (
    <div className="w-full rounded-b-md ">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!inputValue) return;

          const message: Message = {
            avatarUrl,
            username,
            text: inputValue,
          };

          setMessages((messages) => [...messages, message]);

          broadcast({
            type: EventType.Message,
            message,
          } as never);

          setInputValue("");
        }}
      >
        <div className="flex items-center py-2 bg-white rounded-b-md">
          <input
            className="appearance-none border-none w-full text-gray-700 mr-3 py-1 px-3 leading-tight focus:outline-none"
            type="text"
            placeholder="Atspėk žodį..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="mr-2 py-1 px-2 bg-slate-400 hover:bg-slate-500 text-slate-100 rounded"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
