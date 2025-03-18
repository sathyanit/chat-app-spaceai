import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OpenAiService } from '../openai/openai.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  constructor(private readonly openAiService: OpenAiService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() message: { text: string; sender: string }) {
    console.log('Received message:', message);
    this.server.emit('receiveMessage', message); // Send user message

    // AI Assistance
    if (message.text.startsWith('/ai')) {
      const aiResponse = await this.openAiService.generateMessage(message.text.replace('/ai', '').trim());
      this.server.emit('receiveMessage', { text: aiResponse, sender: 'AI' });
    }
  }
}
