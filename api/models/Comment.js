export const Comment = {
  columns: {
    firstName: {
      type: 'varchar',
      nullable: true,
    },
    lastName: {
      type: 'varchar',
      nullable: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
  },
};

export default Comment;
