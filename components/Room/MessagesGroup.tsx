import { Message } from "../../shared/types";
import { Avatar } from "./Avatar";

export function MessagesGroup({ messages }: { messages: Message[] }) {
  return (
    <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-0.5 text-xs max-w-xs mx-2 order-2 items-start">
          {messages.map((message) => (
            <div key={message.id}>
              <span
                className={`px-4 py-2 rounded inline-block bg-white text-gray-600 border ${
                  message === messages[0] ? "rounded-t-lg" : ""
                } ${
                  message === messages[messages.length - 1]
                    ? "rounded-b-lg"
                    : ""
                } ${message.correct ? "border-emerald-300" : ""}`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <Avatar
          avatarUrl={messages[0].avatarUrl}
          username={messages[0].username}
          size={32}
          drawing={false}
        />
      </div>
    </div>
  );
}
