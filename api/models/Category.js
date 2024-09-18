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
};
