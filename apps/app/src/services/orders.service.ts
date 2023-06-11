import {
  ClothStatus,
  ICloth,
  ICreateOrder,
  IOrderDetails,
} from '@e-pressing/interfaces';

export type PlacedOrder = Omit<ICloth, 'cloth_id'> & {
  _id: string;
  order_number: string;
  client_fullname: string;
  client_phone_number: string;
};
type Database = Realm.Services.MongoDBDatabase;

export async function getOrders(
  db: Database,
  filter: {
    status?: ClothStatus;
    order_number?: string;
  }
) {
  const orders = await db
    .collection<PlacedOrder>('placed_orders')
    .find(
      filter.order_number && filter.status
        ? filter
        : filter.order_number
        ? { order_number: filter.order_number }
        : filter.status
        ? { status: filter.status }
        : {}
    );
  return orders?.reduce(
    (
      groupOrders,
      {
        _id,
        cloth_name,
        order_number,
        quantity,
        status,
        washing_price,
        client_fullname,
        client_phone_number,
      }
    ) => {
      if (groupOrders.find((_) => _.order_number === order_number)) {
        return groupOrders.map((order) => ({
          ...order,
          cloths: [
            ...order.cloths,
            { cloth_id: _id, cloth_name, quantity, washing_price, status },
          ],
        }));
      } else
        return [
          ...groupOrders,
          {
            order_number,
            status,
            client_fullname,
            client_phone_number,
            cloths: [
              { cloth_id: _id, cloth_name, washing_price, quantity, status },
            ],
          },
        ];
    },
    [] as IOrderDetails[]
  );
}

export async function createNewOrder(
  db: Database,
  { client_fullname, client_phone_number, cloths }: ICreateOrder
) {
  const data = await db.collection<PlacedOrder>('placed_orders').insertMany(
    cloths.map((cloth) => ({
      ...cloth,
      client_fullname,
      status: 'PENDING',
      client_phone_number,
      order_number: `EP${Math.random()
        .toString(36)
        .split('.')[1]
        .toUpperCase()
        .substring(0, 6)}`,
    }))
  );
  return data;
}

export async function changeOrderStatus(
  db: Database,
  { orderIds, status }: { orderIds: string[]; status: ClothStatus }
) {
  await db
    .collection<PlacedOrder>('placed_orders')
    .updateMany({ _id: { $in: orderIds } }, { status });
}
