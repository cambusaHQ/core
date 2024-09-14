export default {
  routes: {
    'GET /': 'root',
    'POST /users': 'users/create',
    'GET /users': 'users/list',
    'DELETE /users/:id': 'users/delete',
  },
};
