export default async function createUser(ctx) {
  // Hardcoding user data for testing purposes
  const hardcodedUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  };
  const userRepository = cambusa.db.getRepository('User');
  console.log(cambusa.models);
  const user = new cambusa.models.User();
  user.firstName = 'Enrico';
  user.lastName = 'Deleo';
  user.email = 'enricodeleo@gmail.com';
  const newUser = await userRepository.save(user);
  return newUser;
}
