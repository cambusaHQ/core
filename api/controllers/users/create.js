export default async function createUser() {
  const queryRunner = cambusa.db.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    const userRepository = queryRunner.manager.getRepository('User');
    const user = userRepository.create({
      firstName: "Rishit",
      lastName: "test123",
      email: "enrico@enrico.it",
    });

    await userRepository.save(user);

    await queryRunner.commitTransaction();

    cambusa.log.info('User created successfully');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    cambusa.log.error(`Error creating user: ${error.message}`);
    console.error('Stack trace:', error.stack);
  } finally {
    await queryRunner.release();
  }
}
