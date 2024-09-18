export default function exampleHook(cambusa) {
  cambusa.registerHook('afterDatabaseInitialized', async () => {
    cambusa.log.info('Example Hook: Database has been initialized.');
    // Additional logic here
  });
}
