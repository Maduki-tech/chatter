import { Server, Socket } from 'socket.io'

const SocketHandler = (req: any, res: any) => {
    if (res.socket.server.io) {
        console.log('Socket already initialized')
    } else {
        console.log('Initializing socket')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        // Server-side code
        io.on('connection', (socket: Socket) => {
            console.log('A user connected:', socket.id)

            socket.on('send-message', ({message, user}: any) => {
                // Send the message only to other clients, not back to the sender
                socket.broadcast.emit('receive-message', {
                    id: socket.id,
                    message: message,
                    user: user,
                })
            })

            socket.on('disconnect', () => {
                console.log('A user disconnected:', socket.id)
            })
        })
    }
    res.end()
}

export default SocketHandler
