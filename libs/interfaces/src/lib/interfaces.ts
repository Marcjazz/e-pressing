export type ClothStatus = 'IN' | 'READY' | 'OUT';
export interface ICreateCloth {
  cloth_name: string;
  cloth_color: string;
  washing_price: number;
  quantity: number;
}
export interface ICloth extends ICreateCloth {
  cloth_id: string;
  status: ClothStatus;
}
export interface ICreateOrder {
  cloths: ICreateCloth[];
  description: string;
}

export interface IOrder extends ICreateOrder {
  order_id: string;
  cloths: ICloth[];
  status: ClothStatus;
}
