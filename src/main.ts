import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.header('Content-Range', 'products 0-20/20')

    next();
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();