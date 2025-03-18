import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000; // Change from 3000 to 4000
await app.listen(port);
console.log(`Server running on port ${port}`);
  // await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
config();
