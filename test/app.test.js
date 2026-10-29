
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { handleRequest } from '../src/app.js';

let server;
let baseUrl;

// Start a temporary server before running tests.
before(async () => {
  server = createServer(handleRequest);

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

// Stop the server after all tests finish.
after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

// Test 1: Health check.
test('GET /health returns healthy status', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'ok'
  });
});

// Test 2: Valid greeting.
test('GET /greet returns a personalized message', async () => {
  const response = await fetch(`${baseUrl}/greet?name=Alex`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    message: 'Hello, Alex!'
  });
});

// Test 3: Missing name.
test('GET /greet rejects a missing name', async () => {
  const response = await fetch(`${baseUrl}/greet`);

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'name is required'
  });
});

// Test 4: Unknown route.
test('GET /unknown returns 404', async () => {
  const response = await fetch(`${baseUrl}/unknown`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: 'Not found'
  });
});

// Test 5: Unsupported HTTP method.
test('POST /health is rejected', async () => {
  const response = await fetch(`${baseUrl}/health`, {
    method: 'POST'
  });

  assert.equal(response.status, 405);
  assert.deepEqual(await response.json(), {
    error: 'Method not allowed'
  });
});
  