export class EntitySubscriber {
  constructor() {
    this.removedEntities = new Map();
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
    const { entityId } = event;
    const removedInfo = this.removedEntities.get(entityId);
    if (removedInfo) {
      console.log(`Entity removed: ${removedInfo.name}`, removedInfo.data);
      this.removedEntities.delete(entityId);
    } else {
      console.log(`Entity removed: Unknown`, entityId);
    }
  }
}
