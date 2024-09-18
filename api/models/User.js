export const User = {
  routes: {
    disabled: [], // possible values: readAll, readOne, create, update, delete or true to disable them all
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

export default User;
