import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderModel } from './order.model';

@Module({
  imports: [SequelizeModule.forFeature([OrderModel])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
