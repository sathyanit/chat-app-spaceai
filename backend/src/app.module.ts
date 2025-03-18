import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { OpenAiService } from './openai/openai.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthMiddleware } from './auth/auth.middleware';


@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, ChatGateway, OpenAiService, AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*'); // Protect all routes
  }
}
