import Cambusa from '@lib/cambusa.js';

const cambusa = global.cambusa = new Cambusa();

await cambusa.initialize();
await cambusa.startServer();
