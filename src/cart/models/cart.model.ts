import {
  Model,
  Column,
  Table,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { DataTypes, Transaction } from 'sequelize';
import { CartType } from '../cart.types';
import { CartItemModel } from './cart-item.model';

@Table({
  tableName: 'carts',
})
export class CartModel extends Model {
  @PrimaryKey
  @Column({ field: 'id', type: DataTypes.UUIDV4 })
  id: string;

  @Column({ field: 'user_id', type: DataTypes.UUIDV4 })
  userId: string;

  @Column({ field: 'status', defaultValue: 'OPEN' })
  status: string;

  @HasMany(() => CartItemModel)
  items: CartItemModel[];

  @Column({ field: 'created_at', type: DataTypes.DATE })
  createdAt: string;

  @Column({ field: 'updated_at', type: DataTypes.DATE })
  updatedAt: string;

  @Column({ field: 'isdeleted' })
  isDeleted: boolean;

  static async findOneByUserId(
    userId: string,
    transaction: Transaction,
  ): Promise<CartModel> {
    return await this.findOne({
      where: {
        userId: userId,
        isDeleted: false,
      },
      include: [CartItemModel],
      transaction,
    });
  }

  static async updateByCartId(
    updatedCart: CartType,
    transaction: Transaction,
  ): Promise<[number, CartModel[]]> {
    return await this.update(updatedCart, {
      where: {
        id: updatedCart.id,
        isDeleted: false,
      },
      transaction,
    });
  }

  static async deleteItemByUserId(
    userId: string,
    transaction: Transaction,
  ): Promise<void> {
    await this.update(
      { isDeleted: true },
      {
        where: {
          userId: userId,
          isDeleted: false,
        },
        transaction,
      },
    );
  }
}
