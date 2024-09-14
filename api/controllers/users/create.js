export default async function createUser(ctx) {
  const userRepository = cambusa.db.getRepository('User');
  const newUser = await userRepository.save(ctx.body);
  return newUser;
}
