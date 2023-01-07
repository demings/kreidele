import { nanoid } from "nanoid";
import { Avatar } from "./Avatar";

interface ChatMessagesProps {
  messages: string[];
  avatarUrl: string;
  username: string;
}

export function ChatMessages({
  messages,
  avatarUrl,
  username,
}: ChatMessagesProps) {
  return (
    <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-0.5 text-xs max-w-xs mx-2 order-2 items-start">
          {messages.map((message) => (
            <div key={nanoid()}>
              <span
                className={`px-4 py-2 rounded inline-block bg-white text-gray-600 border ${
                  message === messages[0] ? "rounded-t-lg" : ""
                } ${
                  message === messages[messages.length - 1]
                    ? "rounded-b-lg"
                    : ""
                }`}
              >
                {message}
              </span>
            </div>
          ))}
        </div>
        <Avatar avatarUrl={avatarUrl} username={username} size={32} />
      </div>
    </div>
  );
}
