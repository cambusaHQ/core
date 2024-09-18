export default async function createUser() {
  let user;

  try {
    user = await cambusa.models.User.save({
      firstName: 'Alice',
      email: 'alice@exasdsssssmple.com',
    });
  } catch (error) {
    cambusa.log.error(`Error creating user: ${error.message}`);
  }

  return user;
}
