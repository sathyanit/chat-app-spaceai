import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway {
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() message: { text: string; sender: string }) {
      this.server.emit('receiveMessage', message);
    }
  }
  