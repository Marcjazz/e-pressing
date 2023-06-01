export type ClothStatus = 'PENDING' | 'WASHED' | 'REMOVED';
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
  cloths: ICloth[];
  order_number: string;
  status: ClothStatus;
}
