import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'products',
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ field: 'id', type: DataTypes.UUIDV4 })
  id: string;

  @Column({ field: 'title', type: DataTypes.STRING })
  title: string;

  @Column({ field: 'description', type: DataTypes.STRING })
  description: string;

  @Column({ field: 'price', type: DataTypes.INTEGER })
  price: number;
}
