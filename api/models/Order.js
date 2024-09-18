export default {
  columns: {
    orderNumber: {
      type: 'string',
      unique: true,
    },
    orderDate: {
      type: 'date',
    },
    totalAmount: {
      type: 'decimal',
    },
    status: {
      type: 'string',
    },
    metadata: {
      type: 'json',
      nullable: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      inverseSide: 'orders',
    },
    orderItems: {
      target: 'OrderItem',
      type: 'one-to-many',
      inverseSide: 'order',
    },
  },
};
