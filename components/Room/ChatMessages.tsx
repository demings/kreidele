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
        <div className="flex flex-col space-y-1 text-xs max-w-xs mx-2 order-2 items-start">
          {messages.map((message) => (
            <div>
              <span className="px-4 py-2 rounded-lg inline-block bg-white text-gray-600 border">
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
