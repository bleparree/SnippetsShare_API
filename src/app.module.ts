import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestrictedLabelsModule } from './restricted-labels/restricted-labels.module';

@Module({
  imports: [RestrictedLabelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
