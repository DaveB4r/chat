import { FC } from "react";
import Message from "./Message";

type MessageType = {
  message: string;
  username: string;
  time: string;
};

interface MessagesProps {
  message: string;
  messages: MessageType[];
  handleSendMessage: Function;
  setMessage: Function;
  username: string;
}

const Messages: FC<MessagesProps> = ({
  message,
  messages,
  handleSendMessage,
  setMessage,
  username
}) => {
  return (
    <div className="messages-container">
      <ul>
        {messages &&
          messages.map((message, i) => (
            <Message
              id={i + message.username}
              message={message.message}
              username={message.username}
              userSend={username}
              time={message.time}
            />
          ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
