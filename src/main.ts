import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export const createApp = async (app) => {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  return app;
};
async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = await createApp(app);
  await app.listen(5000);
}
bootstrap();
