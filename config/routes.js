export default {
  routes: {
    'GET /': 'root',
    'GET /users': 'users/list',
    'DELETE /users/:id': 'users/delete',
  },
};
