import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { OpenAiService } from './openai/openai.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway, OpenAiService],
})
export class AppModule {}
