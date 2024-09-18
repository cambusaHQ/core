export default async function listUsers(ctx) {
  // Fetch all users from the database
  const users = await cambusa.models.User.find();

  // Return the list of users
  return users;
}
