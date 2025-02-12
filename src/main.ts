import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  } catch (err) {
    console.error('Error starting app:', err);
    process.exit(1);
  }
}
bootstrap();
