import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../order.types';
import { InjectModel } from '@nestjs/sequelize';
import { OrderModel } from '../order.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderModel) private readonly orderModel: typeof OrderModel,
    private readonly sequelize: Sequelize,
  ) {}

  async findById(orderId: string, t?: Transaction): Promise<Order> {
    const transaction = t ? t : await this.sequelize.transaction();
    return await this.orderModel.getItemById(orderId, transaction);
  }

  async create(data: any, t?: Transaction) {
    const transaction = t ? t : await this.sequelize.transaction();
    const id = v4();
    const order = {
      ...data,
      id,
      status: 'ORDERED',
    };

    return await this.orderModel.createItem(order, transaction);
  }

  async update(orderId, data, t: Transaction) {
    const transaction = t ? t : await this.sequelize.transaction();
    return await this.orderModel.updateItemById(orderId, data, transaction);
  }
}
