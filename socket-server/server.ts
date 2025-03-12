import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: [
      'https://kisanswap.in',
      'https://www.kisanswap.in',
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

interface User {
  userId: string;
  socketId: string;
}

let waitingUsers: User[] = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('startMatching', async ({ userId }) => {
    try {
      console.log('User started matching:', userId);

      // Add user to waiting list
      waitingUsers.push({ userId, socketId: socket.id });

      // If we have at least 2 users waiting, make a match
      if (waitingUsers.length >= 2) {
        const user1 = waitingUsers[0];
        const user2 = waitingUsers[1];

        // Remove matched users from waiting list
        waitingUsers = waitingUsers.slice(2);

        // Create chat room in database
        const chatRoom = await prisma.chatRoom.create({
          data: {
            participants: {
              connect: [
                { id: user1.userId },
                { id: user2.userId }
              ]
            }
          }
        });

        // Notify both users about the match
        io.to(user1.socketId).emit('matched', {
          initiator: true,
          targetId: user2.socketId,
          roomId: chatRoom.id
        });

        io.to(user2.socketId).emit('matched', {
          initiator: false,
          targetId: user1.socketId,
          roomId: chatRoom.id
        });
      }
    } catch (error) {
      console.error('Error in startMatching:', error);
      socket.emit('error', { message: 'Failed to start matching' });
    }
  });

  socket.on('signal', ({ signal, targetId }) => {
    io.to(targetId).emit('signal', { signal, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    waitingUsers = waitingUsers.filter(user => user.socketId !== socket.id);
  });
});

const PORT = process.env.PORT || process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 