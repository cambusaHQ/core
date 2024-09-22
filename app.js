import Cambusa from '@lib/cambusa.js';

const cambusa = (global.cambusa = new Cambusa());

await cambusa.initialize();

// Only lift if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await cambusa.lift();
}

export default cambusa;
