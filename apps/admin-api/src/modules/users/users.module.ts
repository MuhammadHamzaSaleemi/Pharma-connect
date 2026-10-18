import { Module } from '@nestjs/common';
import { AuthTransformer } from '../auth/transformers/auth.transformer';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthTransformer],
})
export class UsersModule {}
