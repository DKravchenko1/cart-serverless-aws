import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel } from './models/cart.model';
import { CartItemModel } from './models/cart-item.model';
import { ProductModel } from './models/product.model';

@Module({
  imports: [
    OrderModule,
    SequelizeModule.forFeature([CartModel, CartItemModel, ProductModel]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
