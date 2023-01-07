import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { Message } from "../../shared/types";
import { ChatMessages } from "./ChatMessages";

interface ChatHistoryProps {
  messages: Message[];
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  const bottomRef = useRef();

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    (bottomRef.current as any)?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groupedMessages = messages.reduce((accumulator, current) => {
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
  }, [] as Message[][]);

  return (
    <div className="flex-1 px-4 pt-2 justify-between flex flex-col">
      <div
        id="messages"
        className="flex flex-col space-y-1 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {groupedMessages.map((group) => (
          <ChatMessages
            avatarUrl={group[0].avatarUrl}
            messages={group.map((m) => m.text)}
            username={group[0].username}
            key={nanoid()}
          />
        ))}
        <div ref={bottomRef as never} />
      </div>
    </div>
  );
}
