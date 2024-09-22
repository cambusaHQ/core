#!/usr/bin/env bun

/**
 * Data Generation Script
 *
 * This script generates N fake records for each model defined in the Cambusa application.
 *
 * Usage:
 *   bun run bin/cambusa.js run utilities/generateData --count=100
 *
 * Options:
 *   --count=<number>   Number of records to generate per model (default: 100)
 */

import { faker } from '@faker-js/faker';

/**
 * Generates fake data for a given model.
 * @param {Object} model - The model object
 * @param {number} count - Number of records to generate
 * @returns {Array} - Array of generated records
 */
function generateFakeData(model, count) {
  const records = [];

  for (let i = 0; i < count; i++) {
    const record = {};

    for (const [columnName, columnDef] of Object.entries(model.columns)) {
      if (columnName.toLowerCase() === 'id') continue;

      let value;

      if (columnDef.validation) {
        value = generateValueByValidation(columnDef.validation, columnDef.type);
      } else {
        value = generateValueByType(columnDef.type);
      }

      // Handle nullable fields
      if (columnDef.nullable && faker.datatype.boolean()) {
        value = null;
      }

      record[columnName] = value;
    }

    records.push(record);
  }

  return records;
}

function generateValueByValidation(validation, type) {
  const format = validation.format;
  const min = validation.minimum || validation.exclusiveMinimum;
  const max = validation.maximum || validation.exclusiveMaximum;
  const minLength = validation.minLength;
  const maxLength = validation.maxLength;
  const pattern = validation.pattern;

  switch (type) {
    case 'string':
      if (format === 'email') return faker.internet.email();
      if (format === 'uri') return faker.internet.url();
      if (format === 'uuid') return faker.string.uuid();
      if (format === 'date-time') return faker.date.recent().toISOString();
      if (pattern) return faker.string.alphanumeric({ length: 10 }); // Simplified pattern matching
      return faker.string.sample({ min: minLength || 1, max: maxLength || 20 });

    case 'number':
    case 'integer':
      return faker.number.int({ min: min || 0, max: max || 1000 });

    case 'boolean':
      return faker.datatype.boolean();

    case 'array': {
      const minItems = validation.minItems || 0;
      const maxItems = validation.maxItems || 5;
      return Array.from(
        { length: faker.number.int({ min: minItems, max: maxItems }) },
        () => generateValueByType(validation.items?.type || 'string')
      );
    }

    case 'object':
      return {}; // Simplified object generation

    default:
      return generateValueByType(type);
  }
}

function generateValueByType(type) {
  switch (type) {
    case 'text':
      return faker.lorem.paragraph();
    case 'string':
      return faker.lorem.word();
    case 'boolean':
      return faker.datatype.boolean();
    case 'date':
      return faker.date.past();
    case 'decimal':
    case 'float':
      return faker.number.float({ min: 0, max: 1000, precision: 0.01 });
    case 'integer':
      return faker.number.int({ min: 1, max: 1000 });
    case 'json':
      return JSON.stringify({
        [faker.string.alpha(10)]: faker.number.int({ min: 1, max: 1000 }),
      });
    case 'uuid':
      return faker.string.uuid();
    default:
      return null;
  }
}

/**
 * Main function to generate data for all models.
 * @param {Object} cambusa - The Cambusa instance
 * @param {Array} args - Additional arguments
 */
export default async function (cambusa, args) {
  try {
    // Parse arguments
    const countArg = args.find((arg) => arg.startsWith('--count='));
    const count = countArg ? parseInt(countArg.split('=')[1], 10) : 10;

    if (isNaN(count) || count <= 0) {
      console.error('Invalid count value. Please provide a positive integer.');
      process.exit(1);
    }

    if (!cambusa.schemas || Object.keys(cambusa.schemas).length === 0) {
      cambusa.log.debug('No models found to generate data for.');
      return;
    }

    for (const model of cambusa.schemas) {
      cambusa.log.debug(
        `Generating ${count} records for model: ${model.name}...`
      );
      const fakeData = generateFakeData(model, count);
      const cleanData = fakeData.map((data) => {
        delete data.createdAt;
        delete data.updatedAt;
        delete data.id;
        return data;
      });
      cambusa.log.debug(cleanData);

      try {
        await cambusa.models[model.name].save(cleanData);
        cambusa.log.debug(
          `Successfully generated ${count} records for ${model.name}.`
        );
      } catch (modelError) {
        console.error(
          `Failed to generate data for ${model.name}:`,
          modelError.message
        );
      }
    }

    cambusa.log.debug('Data generation completed successfully.');
  } catch (error) {
    console.error('An error occurred during data generation:', error.message);
    process.exit(1);
  }
}
