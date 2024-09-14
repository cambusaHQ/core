export default async function listUsers(ctx) {
  const userRepository = cambusa.db.getRepository('User');

  // Fetch all users from the database
  const users = await userRepository.find();

  // Return the list of users
  return users;
}
