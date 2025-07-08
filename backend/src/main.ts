import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin:process.env.NEXT_PUBLIC_SITE_URL,
    credentials: true,
    // methods: 'GET,HEAD,POST,PATCH,DELETE',
    // exposedHeaders: ['Content-Type', 'Cache-Control'],
  });

  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('The API description for your application')
  .setVersion('1.0')
  .addTag('Health Reserve')
  .addBearerAuth(
    {
      type: 'http', 
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'jwt-auth',
  )
  .addSecurityRequirements('Bearer ')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ??  3050);
}
bootstrap();
