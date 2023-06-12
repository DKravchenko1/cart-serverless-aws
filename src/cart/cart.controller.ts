import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { CartService } from './cart.service';
import { Sequelize } from 'sequelize-typescript';

@Controller('cart/api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private readonly sequelize: Sequelize,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    console.log(req.user?.id);
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return {
      items: cart.items,
      id: cart.id,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    // TODO: validate body payload...
    console.log('body', req.body);
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: 0,
      },
    };
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const transaction = await this.sequelize.transaction();
    try {
      const userId = getUserIdFromRequest(req);
      const cart = await this.cartService.findByUserId(userId, transaction);

      if (!(cart && cart.items.length)) {
        const statusCode = HttpStatus.BAD_REQUEST;
        req.statusCode = statusCode;

        return {
          statusCode,
          message: 'Cart is empty',
        };
      }

      const { id: cartId, items } = cart;
      const total = items.length;

      const order = await this.orderService.create(
        {
          ...body,
          userId,
          cartId,
          items,
          total,
        },
        transaction,
      );
      await this.cartService.removeByUserId(userId, transaction);
      await transaction.commit();

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order },
      };
    } catch (e) {
      console.log('error', e);
      await transaction.rollback();
    }
  }
}
