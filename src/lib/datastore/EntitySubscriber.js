import { broadcastChanges } from '@lib/router/websocketHandler.js';

export class EntitySubscriber {
  afterInsert(event) {
    const { entity, metadata } = event;
    cambusa.log.silly(entity, `New entity ${metadata.name} inserted:`);
    broadcastChanges(metadata.name, 'create', entity);
  }

  afterUpdate(event) {
    const { entity, metadata } = event;
    cambusa.log.silly(entity, `Entity ${metadata.name} updated:`);
    broadcastChanges(metadata.name, 'update', entity);
  }

  afterRemove(event) {
    const { entityId, entity, metadata } = event;
    cambusa.log.silly(`Entity ${metadata.name} removed: ${entityId}`);
    broadcastChanges(metadata.name, 'delete', {
      id: entityId,
      ...entity,
    });
  }
}
