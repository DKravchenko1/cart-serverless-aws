import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from './users.model';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
