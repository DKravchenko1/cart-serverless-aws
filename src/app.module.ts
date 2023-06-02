import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';

import { CartModel } from './cart/models/cart.model';
import { ProductModel } from './cart/models/product.model';
import { CartItemModel } from './cart/models/cart-item.model';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { UsersModel } from './users/users.model';
import { OrderModel } from './order/order.model';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATA_BASE_HOST,
      port: +process.env.DATA_BASE_PORT,
      username: process.env.DATA_BASE_USER,
      password: process.env.DATA_BASE_PASSWORD,
      database: process.env.DATA_BASE_NAME,
      synchronize: true,
      models: [CartModel, CartItemModel, ProductModel, UsersModel, OrderModel],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
