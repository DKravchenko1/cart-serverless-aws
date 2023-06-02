export enum StatusEnum {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

export type ProductType = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItemType = {
  product?: ProductType;
  productId: string;
  cartId: string;
  count: number;
  id: string;
};

export type CartType = {
  id: string;
  userId?: string;
  status?: StatusEnum | string;
  items: CartItemType[];
};
