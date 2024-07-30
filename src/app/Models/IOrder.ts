import { IOrderItem } from "./IOrdeItem";

export interface IOrder {
    orderId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    orderItems?: IOrderItem[];
  }