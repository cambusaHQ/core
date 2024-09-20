export default {
  database: {
    type: 'sqlite', // Change this to one of the supported databases in TypeORM
    database: './database.sqlite',
    logging: false,
    synchronize: false, // set to false to use migrations
  },
};
