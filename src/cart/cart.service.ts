import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { v4 } from 'uuid';

import { CartModel } from './models/cart.model';
import { CartType } from './cart.types';
import { CartItemModel } from './models/cart-item.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartModel) private readonly cartModel: typeof CartModel,
    @InjectModel(CartItemModel)
    private readonly cartItemModel: typeof CartItemModel,
    private readonly sequelize: Sequelize,
  ) {}

  async findByUserId(userId: string, t?: Transaction): Promise<CartType> {
    const transaction = t ? t : await this.sequelize.transaction();
    return await this.cartModel.findOneByUserId(userId, transaction);
  }

  async createByUserId(userId: string, t?: Transaction): Promise<CartType> {
    const id = v4();
    const userCart = {
      id,
      userId,
      items: [],
    };
    const transaction = t ? t : await this.sequelize.transaction();
    try {
      const result = await this.cartModel.create(
        { ...userCart },
        { transaction },
      );
      await transaction.commit();
      return result;
    } catch (e) {
      console.log('error', e);
      await transaction.rollback();
    }
  }

  async findOrCreateByUserId(
    userId: string,
    t?: Transaction,
  ): Promise<CartType> {
    const transaction = t ? t : await this.sequelize.transaction();
    try {
      const userCart = await this.findByUserId(userId, transaction);
      const result = userCart ? userCart : await this.createByUserId(userId);
      console.log('userId', userId);
      await transaction.commit();
      return result;
    } catch (e) {
      console.log('error', e);
      await transaction.rollback();
    }
  }

  async updateByUserId(userId: string, { items }: CartType): Promise<CartType> {
    const transaction = await this.sequelize.transaction();
    try {
      const { dataValues } = (await this.findOrCreateByUserId(
        userId,
        transaction,
      )) as any;
      const { id, status, items: currentItems = [] } = dataValues;
      console.log('items ->', items);

      const newItems = [
        ...currentItems,
        ...items.map((el) => ({ ...el, id: v4() })),
      ];
      const updatedCart = { id, userId, status } as CartType;
      console.log('updatedCart ->', updatedCart);

      await this.cartItemModel.updateOrCreateItemByCartId(
        id,
        newItems,
        transaction,
      );
      console.log('created cart_items');
      await this.cartModel.updateByCartId(updatedCart, transaction);

      await transaction.commit();
      return { ...updatedCart, items: [...newItems] };
    } catch (err) {
      console.log('error', err);
      await transaction.rollback();
    }
  }

  async removeByUserId(userId, t?: Transaction): Promise<void> {
    const transaction = t ? t : await this.sequelize.transaction();
    const commit = t ? () => {} : transaction.commit;
    const rollback = t ? () => {} : transaction.rollback;
    try {
      await this.cartModel.deleteItemByUserId(userId, transaction);
      await commit();
    } catch (e) {
      console.log('error', e);
      await rollback();
    }
  }
}
