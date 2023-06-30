import {
  ClothStatus,
  ICloth,
  ICreateOrder,
  IOrder,
  IOrderDetails,
} from '@e-pressing/interfaces';

export interface IPlacedOrder
  extends Omit<IOrder, 'status' | 'number_of_cloths'> {
  _id: string;
  cloths: ICloth[];
}
type Database = Realm.Services.MongoDBDatabase;

export async function getOrders(
  db: Database,
  filter: {
    status?: ClothStatus;
    order_number?: string;
  }
): Promise<IOrder[]> {
  const orders = await db
    .collection<IPlacedOrder>('placed_orders')
    .find(
      filter.order_number && filter.status
        ? filter
        : filter.order_number
        ? { order_number: filter.order_number }
        : filter.status
        ? { status: filter.status }
        : {}
    );
  return orders.map(({ cloths, ...order }) => ({
    ...order,
    status: cloths.find((_) => _.status === 'PENDING')
      ? 'PENDING'
      : cloths.find((_) => _.status === 'WASHED')
      ? 'WASHED'
      : 'REMOVED',
    number_of_cloths: cloths.length,
  }));
}

export async function getOrder(
  db: Database,
  order_number: string
): Promise<IOrderDetails | null> {
  const order = await db
    .collection<IPlacedOrder>('placed_orders')
    .findOne({ order_number });
  return order;
}

export async function createNewOrder(
  db: Database,
  { client_fullname, client_phone_number, reception_date, cloths }: ICreateOrder
) {
  const orderNumber = `EP${Math.random()
    .toString(36)
    .split('.')[1]
    .toUpperCase()
    .substring(0, 6)}`;
  const data = await db.collection<IPlacedOrder>('placed_orders').insertOne({
    reception_date,
    client_fullname,
    client_phone_number,
    order_number: orderNumber,
    cloths: cloths.map((cloth) => ({
      ...cloth,
      status: 'PENDING',
      cloth_id: crypto.randomUUID(),
    })),
  });
  return data;
}

export async function changeOrderStatus(
  db: Database,
  { orderIds, status }: { orderIds: readonly string[]; status: ClothStatus }
) {
  await db
    .collection<IPlacedOrder>('placed_orders')
    .updateMany({ _id: { $in: orderIds } }, { $set: { status } });
}
