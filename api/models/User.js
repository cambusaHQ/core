import { t } from 'elysia';

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
      validation: t.String({ format: 'email' }),
    },
    age: {
      type: 'integer',
      nullable: true,
      validation: t.Integer({ minimum: 0, maximum: 120 }),
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
