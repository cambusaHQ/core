export const User = {
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

export default User;
