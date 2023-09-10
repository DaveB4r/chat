import { FC } from "react";

interface MessageProps {
  id: string;
  message: string;
  username: string;
  userSend: string;
  time: string;
}

const Message: FC<MessageProps> = ({ id, message, username, userSend, time }) => {
  const whoSend = username !== userSend;
  
  return (
    <li
      className={whoSend ? "receive" : "sended"}
      key={id}
      title={time}
    >
      <div>
        <span>{whoSend ? username : "sended"}</span>
      </div>
      {message}
      <small>{time}</small>
    </li>
  );
};

export default Message;
