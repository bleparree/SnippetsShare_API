import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestrictedLabelsModule } from './restricted-labels/restricted-labels.module';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [RestrictedLabelsModule, UsersModule, ResourcesModule, SnippetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
