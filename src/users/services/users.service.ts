import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../users.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel) private readonly usersModel: typeof UsersModel,
    private sequelize: Sequelize,
  ) {}

  async findOne(userId: string, t?: Transaction): Promise<User> {
    const transaction = t ? t : await this.sequelize.transaction();
    const commit = t ? () => Promise.resolve() : transaction.commit;
    const rollback = t ? () => Promise.resolve() : transaction.rollback;
    try {
      const user = await this.usersModel.findOne({
        where: { id: userId },
        transaction,
      });
      await commit();
      return user;
    } catch (err) {
      await rollback();
      throw err;
    }
  }

  async findOneByUserName(name: string, t?: Transaction): Promise<UsersModel> {
    const transaction = t ? t : await this.sequelize.transaction();
    const commit = t ? () => {} : transaction.commit;
    const rollback = t ? () => {} : transaction.rollback;
    try {
      const result = await this.usersModel.findOne({
        where: { name: name },
        attributes: ['id'],
        transaction,
      });
      await commit();
      return result.get();
    } catch (e) {
      await rollback();
      console.log('error', e);
    }
  }

  async createOne(
    { name, password }: Omit<User, 'id'>,
    t?: Transaction,
  ): Promise<User> {
    const transaction = t ? t : await this.sequelize.transaction();
    const commit = t ? () => Promise.resolve() : transaction.commit;
    const rollback = t ? () => Promise.resolve() : transaction.rollback;
    try {
      const id = v4();
      const newUser = { id, name, password };

      await this.usersModel.bulkCreate([newUser], { transaction });
      await commit();
      return newUser;
    } catch (e) {
      await rollback();
      throw e;
    }
  }
}
