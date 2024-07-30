import { IOrderItemDetails } from "./IOrderItemDetails";

export interface OrderConfirmationResult {
    orderId: number;
    customerName: string;
    totalAmount: number;
    orderItems: IOrderItemDetails[];
  }