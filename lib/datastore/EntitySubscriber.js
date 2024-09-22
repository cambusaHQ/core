export class EntitySubscriber {
  afterInsert(event) {
    const { entity, metadata } = event;
    cambusa.log.silly(entity, `New entity ${metadata.name} inserted:`);
  }

  afterUpdate(event) {
    const { entity, metadata } = event;
    cambusa.log.debug(
      entity,
      `Entity ${metadata.name} updated: ${entity.constructor.name}`
    );
  }

  afterRemove(event) {
    const { entityId, metadata } = event;
    cambusa.log.debug(`Entity ${metadata.name} removed: ${entityId}`);
  }
}
