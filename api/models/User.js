export const User = {
  columns: {
    firstName: {
      type: 'varchar',
    },
    lastName: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
  },
};

export default User;
