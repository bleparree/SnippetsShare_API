import { Module } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { SnippetsController } from './snippets.controller';
import { MongodbModule } from 'src/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [SnippetsController],
  providers: [SnippetsService],
})
export class SnippetsModule {}
