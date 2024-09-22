export class EntitySubscriber {
  afterInsert(event) {
    const { entity, metadata } = event;
    cambusa.log.silly(entity, `New entity ${metadata.name} inserted:`);
    // cambusa.broadcastEntityUpdate('create', metadata.name, entity);
  }

  afterUpdate(event) {
    const { entity, metadata } = event;
    cambusa.log.debug(
      entity,
      `Entity ${metadata.name} updated: ${entity.constructor.name}`
    );
    // cambusa.broadcastEntityUpdate('update', metadata.name, entity);
  }

  afterRemove(event) {
    const { entityId, entity, metadata } = event;
    cambusa.log.debug(`Entity ${metadata.name} removed: ${entityId}`);
    // cambusa.broadcastEntityUpdate('delete', metadata.name, {
    //   id: entityId,
    //   ...entity,
    // });
  }
}
