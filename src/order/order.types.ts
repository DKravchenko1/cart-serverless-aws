import { CartItemType } from '../cart/cart.types';

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItemType[];
  payment: PaymentType;
  delivery: DeliveryType;
  comment: string;
  status: string;
  total: number;
};

export type PaymentType = {
  type: string;
  address?: any;
  creditCard?: any;
};

export type DeliveryType = {
  type: string;
  address: any;
};
