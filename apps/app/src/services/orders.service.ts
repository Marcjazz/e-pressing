import {
  ClothStatus,
  ICloth,
  ICreateOrder,
  IOrderDetails,
} from '@e-pressing/interfaces';

export type PlacedOrder = Omit<ICloth, 'cloth_id'> & {
  _id: string;
  order_number: string;
  reception_date: number;
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
        reception_date,
        client_fullname,
        client_phone_number,
      }
    ) => {
      console.log(groupOrders);
      const index = groupOrders.findIndex(
        (_) => _.order_number === order_number
      );
      if (index !== -1) {
        const order = groupOrders[index];
        groupOrders[index] = {
          ...order,
          cloths: [
            ...order.cloths,
            {
              cloth_id: _id,
              cloth_name,
              quantity,
              washing_price,
              status,
            },
          ],
        };
      } else
        groupOrders = [
          ...groupOrders,
          {
            order_number,
            reception_date,
            client_fullname,
            client_phone_number,
            cloths: [
              { cloth_id: _id, cloth_name, washing_price, quantity, status },
            ],
          },
        ];
      return groupOrders;
    },
    [] as IOrderDetails[]
  );
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
  const data = await db.collection<PlacedOrder>('placed_orders').insertMany(
    cloths.map((cloth) => ({
      ...cloth,
      reception_date,
      client_fullname,
      status: 'PENDING',
      client_phone_number,
      order_number: orderNumber,
    }))
  );
  return data;
}

export async function changeOrderStatus(
  db: Database,
  { orderIds, status }: { orderIds: readonly string[]; status: ClothStatus }
) {
  await db
    .collection<PlacedOrder>('placed_orders')
    .updateMany({ _id: { $in: orderIds } }, { $set: { status } });
}
