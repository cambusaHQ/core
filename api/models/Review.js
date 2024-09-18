export default {
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    content: {
      type: 'text',
    },
    rating: {
      type: 'decimal', // Floating-point number for ratings
    },
    createdAt: {
      type: 'date',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' },
      onDelete: 'CASCADE',
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: { name: 'productId' },
      onDelete: 'CASCADE',
    },
  },
};
