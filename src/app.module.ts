import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestrictedLabelsModule } from './restricted-labels/restricted-labels.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RestrictedLabelsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
