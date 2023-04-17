import { Server, Socket } from "socket.io";

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket already initialized");
  } else {
    console.log("Initializing socket");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      console.log("a user connected with ID:", socket.id);

      socket.on("disconnect", () => {
        console.log("a user disconnected with ID:", socket.id);
      });

      socket.on("send-message", (message: string) => {
        console.log("received message:", message);
        io.emit("receive-message", message);
      });
    });
  }
  res.end();
};

export default SocketHandler;
