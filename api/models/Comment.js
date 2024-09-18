export const Comment = {
  routes: {
    // disabled: ['delete'], // Disable the DELETE endpoint for User
    // basePath: '/users',   // Custom base path
  },
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
