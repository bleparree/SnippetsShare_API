import { Module } from '@nestjs/common';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabelsController } from './restricted-labels.controller';
import { MongodbModule } from 'src/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [RestrictedLabelsController],
  providers: [RestrictedLabelsService],
})
export class RestrictedLabelsModule {}
