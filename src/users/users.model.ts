import {
  AllowNull,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'users',
})
export class UsersModel extends Model {
  @PrimaryKey
  @Column({ field: 'id' })
  id: string;

  @Column({ field: 'name' })
  name: string;

  @AllowNull(true)
  @Column({ field: 'email' })
  email?: string;

  @AllowNull(true)
  @Column({ field: 'password' })
  password?: string;

  @Column({ field: 'created_at', type: DataTypes.DATE })
  createdAt: string;

  @Column({ field: 'updated_at', type: DataTypes.DATE })
  updatedAt: string;
}
