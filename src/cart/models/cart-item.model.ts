import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes, Transaction } from 'sequelize';
import { CartModel } from './cart.model';
import { ProductModel } from './product.model';
import { CartItemType } from '../cart.types';

@Table({
  tableName: 'cart_items',
  timestamps: false,
})
export class CartItemModel extends Model {
  @PrimaryKey
  @Column({ field: 'id' })
  id: string;

  @Column({ field: 'product_id' })
  @ForeignKey(() => ProductModel)
  productId: string;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @Column({ field: 'cart_id' })
  @ForeignKey(() => CartModel)
  cartId: string;

  @Column({ field: 'count', type: DataTypes.INTEGER })
  count: number;

  static async updateOrCreateItemByCartId(
    cartId: string,
    items: CartItemType[],
    transaction: Transaction,
  ) {
    return new Promise<void>((resolve, reject) => {
      Promise.all(
        items.map(async (item) => {
          const { id } = item;
          const itemFromDB = await this.findOne({
            where: { id: id },
            transaction,
          });
          if (!itemFromDB) {
            return await this.create({ ...item }, { transaction });
          } else {
            return await this.update(
              { ...item },
              { where: { id: id }, transaction },
            );
          }
        }),
      )
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }
}
