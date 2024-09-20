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

    // Iterate over each column in the model to generate appropriate fake data
    for (const [columnName, columnDef] of Object.entries(model.columns)) {
      // Skip auto-generated fields like 'id' if present
      if (columnName.toLowerCase() === 'id') continue;

      switch (columnDef.type) {
        case 'text':
          record[columnName] = faker.lorem.words(10);
          break;
        case 'string':
          record[columnName] = faker.lorem.words(1);
          break;
        case 'boolean':
          record[columnName] = faker.datatype.boolean();
          break;
        case 'date':
          record[columnName] = faker.date.past();
          break;
        case 'decimal':
          record[columnName] = faker.number.float();
          break;
        case 'integer':
          record[columnName] = faker.number.int({ min: 1, max: 1000 });
          break;
        case 'json':
          record[columnName] = JSON.stringify({
            [faker.string.alpha(10)]: faker.number.int({ min: 1, max: 1000 }),
          });
          break;
        case 'uuid':
          record[columnName] = faker.string.uuid();
          break;
        // Add more cases as needed based on your column types
        default:
          record[columnName] = null;
      }

      // Handle nullable fields
      if (columnDef.nullable && faker.datatype.boolean()) {
        record[columnName] = null;
      }
    }

    records.push(record);
  }

  return records;
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
