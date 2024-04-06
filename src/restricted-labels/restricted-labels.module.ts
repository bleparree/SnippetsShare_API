import { Module } from '@nestjs/common';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabelsController } from './restricted-labels.controller';

@Module({
  controllers: [RestrictedLabelsController],
  providers: [RestrictedLabelsService],
})
export class RestrictedLabelsModule {}
