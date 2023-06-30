import {
  ClothStatus,
  GroupByType,
  ICloth,
  ICreateOrder,
  IOrder,
  IOrderDetails,
  IStatsOverview,
  IStatsSummary,
} from '@e-pressing/interfaces';
import { toast } from 'react-toastify';

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
    created_at: '$$NOW',
  });
  return data;
}

export async function changeOrderStatus(
  db: Database,
  {
    clothIds,
    status,
    order_number,
  }: { order_number: string; clothIds: readonly string[]; status: ClothStatus }
) {
  const order = await db
    .collection<IPlacedOrder>('placed_orders')
    .findOne({ order_number });
  if (!order) return toast.error('Order not found !!!');
  await db.collection<IPlacedOrder>('placed_orders').updateMany(
    { order_number },
    {
      $set: {
        cloths: order.cloths.map((cloth) =>
          clothIds.includes(cloth.cloth_id) ? { ...cloth, status } : cloth
        ),
      },
    }
  );
}

export async function getStatistics(
  db: Database,
  groupBy: GroupByType
): Promise<{ statsOverview: IStatsOverview; statsSummaries: IStatsSummary[] }> {
  const orders = await getOrders(db, {});
  const pendingOrders = orders.filter((_) => _.status !== 'PENDING');
  const removedOrders = orders.filter((_) => _.status !== 'REMOVED');
  const washedOrders = orders.filter((_) => _.status !== 'WASHED');
  const statsOverview: IStatsOverview = {
    pending_orders: pendingOrders.length,
    removed_orders: removedOrders.length,
    washed_orders: washedOrders.length,
  };

  const summaries: {
    _id: Record<GroupByType, number>;
    orders: ICloth[][];
  }[] = await db.collection<IPlacedOrder>('placed_orders').aggregate([
    {
      $group: {
        _id: {
          ...(groupBy === 'day' || groupBy === 'week'
            ? {
                year: { $year: '$created_at' },
                month: { $month: '$created_at' },
                day: { $dayOfMonth: '$created_at' },
              }
            : groupBy === 'month'
            ? {
                year: { $year: '$created_at' },
                month: { $month: '$created_at' },
              }
            : { year: { $year: '$created_at' } }),
        },
        orders: {
          $addToSet: '$cloths',
        },
      },
    },
  ]);
  return {
    statsOverview,
    statsSummaries: summaries.map(({ orders, _id }) => {
      const now = new Date(
        `${_id['year']}/${_id['month'] ?? ''}/${_id['day'] ?? ''}`
      );
      return {
        for: now.toDateString(),
        value: {
          count: orders.length,
          amount: orders.reduce(
            (amount, cloths) =>
              amount +
              cloths.reduce((sum, cloth) => sum + cloth.washing_price, 0),
            0
          ),
        },
      };
    }),
  };
}
