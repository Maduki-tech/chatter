import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { Socket } from 'socket.io';
import io from 'Socket.io-client';
type Message = {
    myMessage: boolean;
    user: string;
    message: string;
};

export default function ChatScreen() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const chatContainer = React.useRef<HTMLDivElement>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const socketRef = React.useRef<Socket>();
    const { user } = useUser();

    useEffect(() => {
        fetch('/api/socket');
        // @ts-ignore
        socketRef.current = io();

        socketRef.current?.on('connect', () => {});
        socketRef.current?.on(
            'receive-message',
            (data: { message: string; id: string; user: string }) => {
                console.log(data);
                const myMessage = data.id === socketRef.current!.id;
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { myMessage, message: data.message, user: data.user },
                ]);
            }
        );

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight);
    }, [messages]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = inputRef.current?.value;
        setMessages((prevMessages) => [
            ...prevMessages,
            { myMessage: true, message: message!, user: user?.fullName! },
        ]);
        socketRef.current!.emit('send-message', {
            message: message!,
            user: user?.fullName!,
        });
        inputRef.current!.value = '';
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
                        <SendMessage message={message.message} key={index} user={message.user} />
                    ) : (
                        <RecivedMessage message={message.message} key={index} user={message.user}/>
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
    user: string;
};
const SendMessage = (message: SendMessageProps) => {
    return (
        <div className="grid grid-cols-2 gap-4 ">
            <div></div>
            <div className="col-span-1 rounded-md bg-gradient-to-r from-purple-500 to-purple-600 p-2 text-white h-fit">
                <span className="text-sm font-thin text-gray-300">
                    {message.user}
                </span>
                <p>{message.message}</p>
            </div>
        </div>
    );
};

const RecivedMessage = (message: SendMessageProps) => {
    console.log(message.user);
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 rounded-md bg-gradient-to-r from-purple-500 to-purple-600 p-2 text-white h-fit">
                <span className="text-sm font-thin text-gray-300">
                    {message.user}
                </span>
                <p>{message.message}</p>
            </div>
        </div>
    );
};
