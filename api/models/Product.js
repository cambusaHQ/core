export default {
  columns: {
    name: {
      type: 'string',
      unique: true,
    },
    description: {
      type: 'text', // Long text field
    },
    price: {
      type: 'decimal',
    },
    createdAt: {
      type: 'date',
    },
    updatedAt: {
      type: 'date',
    },
  },
  relations: {
    owner: {
      type: 'many-to-one',
      target: 'User', // Reference to User entity
      joinColumn: { name: 'ownerId' }, // Foreign key column in Product
      onDelete: 'CASCADE',
    },
  },
};
