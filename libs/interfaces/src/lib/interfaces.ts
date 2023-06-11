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
  client_fullname: string;
  client_phone_number: string;
}

export interface IOrderDetails extends ICreateOrder {
  cloths: ICloth[];
  order_number: string;
}
export type Client = Omit<ICreateOrder, 'cloths'>;
export type Error = {
  error: string;
  item_id: string;
  field: keyof (ICreateCloth & Client);
};
export type Item = { item_id: string; value: ICreateCloth };
