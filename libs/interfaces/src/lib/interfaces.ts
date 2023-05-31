export type ClothStatus = 'PENDING' | 'READY' | 'REMOVED';
export interface ICreateCloth {
  cloth_name: string;
  washing_price: number;
  quantity: number;
}
export interface ICloth extends ICreateCloth {
  cloth_id: string;
  status: ClothStatus;
}
export interface ICreateOrder {
  cloths: ICreateCloth[];
}

export interface IOrder extends ICreateOrder {
  order_id: string;
  cloths: ICloth[];
  order_number: string;
  status: ClothStatus;
}
