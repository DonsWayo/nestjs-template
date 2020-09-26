import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypegooseModule } from 'nestjs-typegoose/dist/typegoose.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`./env/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration]
    }),
    TypegooseModule.forRoot(process.env.DATABASE || 'mongodb://localhost:27017/dbname', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    AuthModule,
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
