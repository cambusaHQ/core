export default {
  security: {
    cors: {
      origin: true,
      methods: '*',
      allowedHeaders: '*',
      exposeHeaders: '*',
      credentials: true,
      preflight: true,
    },
  },
}
