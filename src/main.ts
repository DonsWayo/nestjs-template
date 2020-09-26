import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { join } from 'path';
import * as helmet from 'helmet';
import * as swStats from 'swagger-stats'
import * as bodyParser from 'body-parser';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

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

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(compression());
  app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1000000,
    message:
      "Too many requests from this IP, please try again later"
  }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
