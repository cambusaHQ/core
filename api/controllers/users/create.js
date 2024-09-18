export default async function createUser() {
  const userRepository = cambusa.db.getRepository('User');
  const user = userRepository.create({
    firstName: "Rishit",
    lastName: "test3",
    email: "enrico@rico.it",
  });

  try {
    await userRepository.insert(user);
  } catch (error) {
    cambusa.log.error(`Error creating user: ${error.message}`);
  }

  return user;
}
