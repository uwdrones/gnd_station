import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    // Serve static files from React build
    app.useStaticAssets(join(__dirname, '..', 'frontend', 'build'));

    // Fallback to index.html for client-side routing
    app.use((req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
      if (req.originalUrl && req.originalUrl.split('/').pop() === 'index.html') {
        return res.status(404).send('Not found');
      }
      next();
    });

    await app.listen(3000);
  } catch (err) {
    console.error('Error starting app:', err);
    process.exit(1);
  }
}
bootstrap();
