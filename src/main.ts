import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS
    app.enableCors();

    // Serve static files from React build
    app.useStaticAssets(join(__dirname, '..', 'frontend', 'build'));

    // API routes are defined with their own prefixes in the controllers

    // For any non-API routes, serve the React app (client-side routing)
    app.use((req: Request, res: Response, next: NextFunction) => {
      // If the request is for an API route, let NestJS handle it
      if (req.originalUrl.startsWith('/api/')) {
        return next();
      }

      // For all other routes, send the index.html file
      res.sendFile(join(__dirname, '..', 'frontend', 'build', 'index.html'));
    });

    await app.listen(3000);
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    console.error('Error starting app:', err);
    process.exit(1);
  }
}
bootstrap();
