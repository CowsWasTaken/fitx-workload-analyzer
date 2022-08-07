import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', "warn", "debug", "log" ,"verbose"]
  });

  const config = new DocumentBuilder()
    .setTitle('FitX-Workload-Analyzer')
    .setDescription('Stores the workload for each studio according to an set interval')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
