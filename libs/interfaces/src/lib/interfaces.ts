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
export interface IClient {
  client_fullname: string;
  client_phone_number: string;
}
export interface ICreateOrder extends IClient {
  cloths: ICreateCloth[];
  reception_date: string;
}

export interface IOrderDetails extends ICreateOrder {
  cloths: ICloth[];
  order_number: string;
}

export type Error = {
  error: string;
  item_id: string;
  field: keyof (ICreateCloth & IClient) | 'reception_date';
};
export type Item = { item_id: string; value: ICreateCloth };

export interface IStatsOverview {
  pending_orders: number;
  washed_orders: number;
  removed_orders: number;
}

export interface IStatsSummary {
  for: string;
  value: {
    count: number;
    amount: number;
  };
}

export interface IOrder extends Omit<IOrderDetails, 'cloths'> {
  status: ClothStatus;
  created_at: Date;
  client_fullname: string;
  number_of_cloths: number;
  client_phone_number: string;
}

export type GroupByType = 'day' | 'week' | 'month' | 'year';
