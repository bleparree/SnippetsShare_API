import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongodbModule } from 'src/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
