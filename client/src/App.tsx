import { useEffect, useRef, useState } from "react"; // import the neccesaries hooks
import { toast, ToastContainer } from "react-toastify"; // import the toast to show an alert
import io from "socket.io-client"; // import the library socket.io to handle the chat
import ConnectedUsers from "./Components/ConnectedUsers/ConnectedUsers"; // component where we show all the users availabes 
import Messages from "./Components/Messages/Messages"; // component with a form to send messages and show messages
import UsernameForm from "./Components/UsernameForm"; // component to render the form to send the user

interface Users { // interface to format users
  id: string;
  username: string;
}

interface Message { // interface to format message
  message: string;
  username: string;
  time: string;
}

const App = () => {
  const [connectedUsers, setConnectedUsers] = useState([] as Users[]); // variable to store the users connected
  const [username, setUsername] = useState(""); // variable to store the username
  const [connected, setConnected] = useState(false); // variable to check if the user is connected
  const [messages, setMessages] = useState([] as Message[]); // variable to store all the messages
  const [message, setMessage] = useState(""); // variable to save the message

  const socketClient = useRef<SocketIOClient.Socket>(); // we're going to use the hook useRef to do reference about socket io client

  useEffect(() => { // hook to render once
    socketClient.current = io.connect("http://localhost:3000"); // we create the connect whit localhost:3000

    if (socketClient.current) {
      // if the username is available
      socketClient.current.on("username-submitted-successfully", () => {
        setConnected(true);
      });
      // else
      socketClient.current.on("username-taken", () => {
        toast.error("username is taken");
      });
      // get the users
      socketClient.current.on(
        "get-connected-users",
        (connectedUsers: Users[]) => {
          setConnectedUsers(
            connectedUsers.filter((user) => user.username !== username) // return all the connected user except our user
          );
        }
      );

      // handle Sockets Messages
      socketClient.current.on("receive-message", (message: Message) => {
        setMessages((prev) => [...prev, message]); // store messages to the variable Messages
      });
    }

    //Disconnecting
    return () => {
      socketClient.current?.disconnect();
      socketClient.current = undefined;
    }
  }, [username]);

  const handleConnection = () => { // we're going to send to the server the username and check if the user exist
    if (socketClient.current) {
      socketClient.current.emit("handle-connection", username);
    }
  };

  const handleSendMessage = () => { // we're going to send to the server the message and then store in the variable messages
    if (socketClient.current) {
      const now = new Date().toLocaleDateString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const time = now.toString();
      const messageTosend: Message = { message, username, time};
      setMessages((prev) => [...prev, messageTosend]);
      socketClient.current.emit("message", messageTosend);
      setMessage("");
    }
  };

  const leaveChat = () => {
    if(socketClient.current){
      socketClient.current.emit("leaveChat");
      setConnected(false);
    }
  }
  return (
    <main>
      {!connected ? ( // if there's no one connected let's render the userform
        <div className="sign-div">
          <div className="sign-logo">
            <img src="/assets/chat-logo.png" alt="logo" />
          </div>
          <UsernameForm
            username={username}
            setUsername={setUsername}
            handleConnection={handleConnection}
          />
        </div>
      ) : (// if there's someone connected lets' show the available users and the chat
        <div className="chat-main">
          <ConnectedUsers Users={connectedUsers} leaveChat={leaveChat}/>
          <Messages
            message={message}
            messages={messages}
            handleSendMessage={handleSendMessage}
            setMessage={setMessage}
            username={username}
          />
        </div>
      )}
      <ToastContainer position="bottom-right" /> {/*let's render a message */}
    </main>
  );
};

export default App;
