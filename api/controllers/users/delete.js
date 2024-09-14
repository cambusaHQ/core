export default async function deleteUser(ctx) {
  const { id } = ctx.params;
  // Handle deleting a user
  return `Deleting user with ID: ${id}`;
}
