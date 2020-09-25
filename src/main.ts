import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as swStats from 'swagger-stats'
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { join } from 'path';


function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '/../public'));

  const options = new DocumentBuilder()
    .setTitle('Nest Api')
    .setDescription('Nest Api')
    .setVersion('1.0')
    .addTag('API')
    .setBasePath('api')
    .addBearerAuth(
      { scheme: 'bearer', name: 'Authorization', in: 'header', type: 'http' }
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.use(ignoreFavicon);
  app.use(swStats.getMiddleware({
    uriPath: '/swagger-stats',
  }));


  await app.listen(3000);
}
bootstrap();
