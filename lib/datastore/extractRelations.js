/**
 * Helper function to extract relations from the request body.
 * @param {Object} body - The request body.
 * @param {Object} relationsDef - The relations definition from model options.
 * @returns {Object} - An object containing relations and cleaned data.
 * @throws {Error} - Throws error if related entities are not found or input is invalid.
 */
export async function extractRelations(body, relationsDef) {
  const relations = {};
  const cleanedData = { ...body };

  if (relationsDef) {
    for (const [relationName, relationOptions] of Object.entries(relationsDef)) {
      const relatedData = body[relationName];

      if (relatedData !== undefined && relatedData !== null) {
        // Remove the relation data from the main data object
        delete cleanedData[relationName];

        try {
          switch (relationOptions.type) {
            case 'many-to-one':
            case 'one-to-one':
              // Expecting a single related entity ID (number or string)
              if (typeof relatedData !== 'number' && typeof relatedData !== 'string') {
                throw new Error(
                  `Invalid type for relation '${relationName}'. Expected a single ID (number or string).`
                );
              }

              const relatedEntity = await cambusa.models[relationOptions.target].findOne({
                where: { id: relatedData },
              });

              if (relatedEntity) {
                relations[relationName] = relatedEntity;
              } else {
                throw new Error(
                  `Related '${relationOptions.target}' with id '${relatedData}' not found for relation '${relationName}'.`
                );
              }
              break;

            case 'one-to-many':
            case 'many-to-many':
              // Expecting an array of related entity IDs
              if (!Array.isArray(relatedData)) {
                throw new Error(
                  `Invalid type for relation '${relationName}'. Expected an array of IDs.`
                );
              }

              if (relatedData.length === 0) {
                relations[relationName] = [];
                break;
              }

              // Ensure all elements are numbers or strings
              if (!relatedData.every(id => typeof id === 'number' || typeof id === 'string')) {
                throw new Error(
                  `Invalid elements in relation '${relationName}'. All IDs should be numbers or strings.`
                );
              }

              const relatedEntities = await cambusa.models[relationOptions.target].findByIds(
                relatedData
              );

              if (relatedEntities.length !== relatedData.length) {
                const foundIds = relatedEntities.map(entity => entity.id);
                const missingIds = relatedData.filter(id => !foundIds.includes(id));
                throw new Error(
                  `Related '${relationOptions.target}' entities with IDs [${missingIds.join(', ')}] not found for relation '${relationName}'.`
                );
              }

              relations[relationName] = relatedEntities;
              break;

            default:
              throw new Error(`Unsupported relation type: '${relationOptions.type}' for relation '${relationName}'.`);
          }
        } catch (error) {
          throw new Error(`Error processing relation '${relationName}': ${error.message}`);
        }
      }
    }
  }

  return { relations, cleanedData };
}

export default extractRelations;
