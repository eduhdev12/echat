import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [AuthModule, UsersModule, ChannelsModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
