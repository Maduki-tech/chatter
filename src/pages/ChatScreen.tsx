import React, { useEffect } from "react";
import { Socket } from "socket.io";
import io from "Socket.io-client";
type Message = {
  myMessage: boolean;
  message: string;
};

export default function ChatScreen() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const chatContainer = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const socketRef = React.useRef<Socket>();
  useEffect(() => {
    socketInitilaize();
  }, []);
  useEffect(() => {
    chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight);
  }, [messages]);

  const socketInitilaize = async () => {
    await fetch("api/socket");
    // @ts-ignore
    socketRef.current = io();
    if (socketRef.current) {
      socketRef.current.on("connect", () => {
        console.log("connected", socketRef.current!.id);
      });
      socketRef.current.on("receive-message", (message: string) => {
        setMessages([...messages, { myMessage: false, message }]);
      });
    }

    console.log(messages);
    return () => {
      socketRef.current?.disconnect();
    };
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef.current?.value;
    if (message) {
      setMessages([...messages, { myMessage: true, message }]);
    }
    // send message to the server
    socketRef.current!.emit("send-message", message);
    inputRef.current!.value = "";
  };

  return (
    <div className="grid place-items-center">
      <h1>Chat Screen</h1>
      <div
        className="grid h-96 w-1/2 gap-4 overflow-y-scroll rounded-md border-4 border-black p-4"
        ref={chatContainer}
      >
        {messages.map((message, index) => {
          return message.myMessage ? (
            <SendMessage message={message.message} />
          ) : (
            <RecivedMessage message={message.message} />
          );
        })}
      </div>

      <form
        className="absolute bottom-0 flex w-full justify-center gap-4 pb-8"
        onSubmit={submit}
      >
        <input
          type="text"
          ref={inputRef}
          placeholder="Message"
          className="w-1/3 rounded-md border border-gray-300 p-1"
        />
        <button
          type="submit"
          className="rounded-md bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-1"
        >
          Send
        </button>
      </form>
    </div>
  );
}

type SendMessageProps = {
  message: string;
};
const SendMessage = (message: SendMessageProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 ">
      <div></div>
      <h1 className="col-span-1 rounded-md bg-gradient-to-r from-purple-500 to-purple-600 p-2 text-white">
        {message.message}
      </h1>
    </div>
  );
};

const RecivedMessage = (message: SendMessageProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <h1 className="col-span-1 rounded-md bg-gradient-to-l from-purple-500 to-purple-600 p-2 text-white">
        {message.message}
      </h1>
      <div></div>
    </div>
  );
};
