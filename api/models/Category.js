export default {
  columns: {
    name: {
      type: 'string',
      unique: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
  },
  relations: {
    parent: {
      type: 'many-to-one',
      target: 'Category', // Self-referential relation
      joinColumn: { name: 'parentId' },
      nullable: true,
      onDelete: 'SET NULL',
    },
  },
};
