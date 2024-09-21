export class EntitySubscriber {
  afterLoad(entity) {
    console.log(`Entity loaded: ${entity.constructor.name}`, entity);
  }

  afterInsert(event) {
    const { entity } = event;
    console.log(`New entity inserted: ${entity.constructor.name}`, entity);
  }

  afterUpdate(event) {
    const { entity } = event;
    console.log(`Entity updated: ${entity.constructor.name}`, entity);
  }

  afterRemove(event) {
    const { entityId, entity } = event;
    console.log(
      `Entity removed: ${entity?.constructor.name || 'Unknown'}`,
      entityId
    );
  }
}
