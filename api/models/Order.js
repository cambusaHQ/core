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
      type: 'json', // Store additional data dynamically
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' },
      onDelete: 'SET NULL',
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: { name: 'productId' },
      onDelete: 'SET NULL',
    },
  },
};
