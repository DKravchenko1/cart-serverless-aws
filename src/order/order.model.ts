import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { CartItemType } from '../cart/cart.types';
import { CartModel } from '../cart/models/cart.model';
import { UsersModel } from '../users/users.model';
import { CartItemModel } from '../cart/models/cart-item.model';
import { DeliveryType, PaymentType } from './order.types';
import { DataTypes, Transaction } from 'sequelize';

@Table({
  tableName: 'orders',
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ field: 'id' })
  id: string;

  @Column({ field: 'user_id' })
  @ForeignKey(() => UsersModel)
  userId: string;

  @Column({ field: 'cart_id' })
  @ForeignKey(() => CartModel)
  cartId: string;

  @BelongsToMany(() => CartModel, () => CartItemModel, 'cart_id')
  items: CartItemType[];

  @Column({ field: 'payment', type: DataTypes.JSON })
  payment: PaymentType;

  @Column({ field: 'delivery', type: DataTypes.JSON })
  delivery: DeliveryType;

  @Column({ field: 'comment' })
  comment: string;

  @Column({ field: 'status' })
  status: string;

  @Column({ field: 'total' })
  total: number;

  static async getItemById(
    id: string,
    transaction: Transaction,
  ): Promise<OrderModel> {
    return this.findOne({ where: { id: id }, transaction });
  }

  static async createItem(data, transaction: Transaction): Promise<OrderModel> {
    return this.create(data, { transaction });
  }

  static async updateItemById(
    id: string,
    data,
    transaction: Transaction,
  ): Promise<[number, OrderModel[]]> {
    return this.update(data, { where: { id }, transaction });
  }
}
