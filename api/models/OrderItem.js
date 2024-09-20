export default {
  columns: {
    quantity: {
      type: 'integer',
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
  },
  relations: {
    order: {
      target: 'Order',
      type: 'many-to-one',
      inverseSide: 'orderItems',
    },
    product: {
      target: 'Product',
      type: 'many-to-one',
      inverseSide: 'orderItems',
    },
  },
};
