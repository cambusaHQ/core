export default {
  columns: {
    firstName: {
      type: 'string',
      nullable: true,
    },
    lastName: {
      type: 'string',
      nullable: true,
    },
    email: {
      type: 'string',
      unique: true,
    },
    age: {
      type: 'integer',
      nullable: true,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
  },
  relations: {
    orders: {
      target: 'Order',
      type: 'one-to-many',
      inverseSide: 'user',
    },
  },
};
