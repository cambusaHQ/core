#!/usr/bin/env bun

import { faker } from '@faker-js/faker';
import minimist from 'minimist';

// Parse command-line arguments
const args = minimist(process.argv.slice(2), {
  alias: {
    u: 'apiUrl',
  },
  default: {
    apiUrl: 'http://localhost:3000',
  },
});

const BASE_URL = args.apiUrl;

// Utility function to make POST requests
async function createEntity(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      const text = await response.text();
      console.error(`Error parsing JSON response from ${endpoint}:`, text);
      return null;
    }

    if (!response.ok) {
      console.error(`Error creating ${endpoint}:`, result);
      return null;
    }

    // Log the entire response for debugging
    console.log(`Created ${endpoint}:`, JSON.stringify(result, null, 2));

    // Return the created entity directly
    return result;
  } catch (error) {
    console.error(`Network error while creating ${endpoint}:`, error);
    return null;
  }
}

// Utility function to make PUT requests
async function updateEntity(endpoint, id, data) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      const text = await response.text();
      console.error(
        `Error parsing JSON response from ${endpoint} ${id}:`,
        text
      );
      return false;
    }

    if (!response.ok) {
      console.error(`Error updating ${endpoint} ${id}:`, result);
      return false;
    }

    // Log the entire response for debugging
    console.log(`Updated ${endpoint} ${id}:`, JSON.stringify(result, null, 2));

    return true;
  } catch (error) {
    console.error(`Network error while updating ${endpoint} ${id}:`, error);
    return false;
  }
}

// Function to create Users
async function createUsers(count = 10) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const userData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 70 }),
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    };
    const user = await createEntity('users', userData);
    if (user) users.push(user);
  }
  return users;
}

// Function to create Categories
async function createCategories(count = 5) {
  const categories = [];
  for (let i = 0; i < count; i++) {
    const categoryData = {
      name: faker.commerce.department() + ' ' + faker.string.uuid().slice(0, 5), // Ensure uniqueness
      description: faker.lorem.sentence(),
    };
    const category = await createEntity('categories', categoryData);
    if (category) categories.push(category);
  }
  return categories;
}

// Function to create Products
async function createProducts(count = 20, categories = []) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const selectedCategories = faker.helpers.arrayElements(
      categories,
      faker.number.int({ min: 1, max: 3 })
    );
    const productData = {
      name:
        faker.commerce.productName() + ' ' + faker.string.uuid().slice(0, 5), // Ensure uniqueness
      description: faker.lorem.paragraph(),
      price: parseFloat(faker.commerce.price()),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      categories: selectedCategories.map((category) => ({ id: category.id })), // Assuming the API accepts category IDs for relations
    };
    const product = await createEntity('products', productData);
    if (product) products.push(product);
  }
  return products;
}

// Function to create Orders
async function createOrders(count = 15, users = []) {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const orderNumber = `ORD-${faker.string.uuid().slice(0, 8).toUpperCase()}`;
    const orderDate = faker.date.past().toISOString();
    const status = faker.helpers.arrayElement([
      'pending',
      'shipped',
      'delivered',
      'cancelled',
    ]);
    const metadata = JSON.stringify({
      notes: faker.lorem.sentence(),
    }); // Stringify metadata to prevent "[object Object]"

    const orderData = {
      orderNumber,
      orderDate,
      totalAmount: 0, // Will be updated after creating order items
      status,
      metadata,
      userId: user.id, // Assuming the API accepts userId for relations
    };

    const order = await createEntity('orders', orderData);
    if (order) orders.push(order);
  }
  return orders;
}

// Function to create OrderItems
async function createOrderItems(orders = [], products = []) {
  for (const order of orders) {
    const itemCount = faker.number.int({ min: 1, max: 5 });
    let totalAmount = 0;
    for (let i = 0; i < itemCount; i++) {
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 10 });
      const price = product.price;
      totalAmount += quantity * price;

      const orderItemData = {
        quantity,
        price,
        orderId: order.id, // Assuming the API accepts orderId for relations
        productId: product.id, // Assuming the API accepts productId for relations
      };

      await createEntity('orderitems', orderItemData);
    }

    // Update the order with the totalAmount
    const updateSuccess = await updateEntity('orders', order.id, {
      totalAmount,
    });
    if (!updateSuccess) {
      console.error(`Failed to update totalAmount for Order ID: ${order.id}`);
    }
  }
}

// Main function to orchestrate data population
async function populateData() {
  console.log('Starting data population...');

  // Step 1: Create Users
  const users = await createUsers(10);
  if (users.length === 0) {
    console.error('No users created. Aborting data population.');
    return;
  }

  // Step 2: Create Categories
  const categories = await createCategories(5);
  if (categories.length === 0) {
    console.error('No categories created. Aborting data population.');
    return;
  }

  // Step 3: Create Products
  const products = await createProducts(20, categories);
  if (products.length === 0) {
    console.error('No products created. Aborting data population.');
    return;
  }

  // Step 4: Create Orders
  const orders = await createOrders(15, users);
  if (orders.length === 0) {
    console.error('No orders created. Aborting data population.');
    return;
  }

  // Step 5: Create OrderItems and Update Orders
  await createOrderItems(orders, products);

  console.log('Data population completed successfully.');
}

// Execute the script
populateData();
