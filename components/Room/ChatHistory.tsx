import { nanoid } from "nanoid";
import { ChatMessages } from "./ChatMessages";

export function ChatHistory() {
  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col">
      <div
        id="messages"
        className="flex flex-col space-y-3 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <ChatMessages
          avatarUrl="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
          messages={["Labas", "Ką tu?"]}
          username="temp"
          key={nanoid()}
        />

        <ChatMessages
          avatarUrl="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
          messages={["Nk"]}
          username="temp"
          key={nanoid()}
        />

        <ChatMessages
          avatarUrl="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
          messages={["Ok"]}
          username="temp"
          key={nanoid()}
        />
      </div>
    </div>
  );
}
