import { Module } from '@nestjs/common';

import { UserService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

@Module({
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule { }
