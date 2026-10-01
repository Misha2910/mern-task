import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { taskCreateSchema, taskUpdateSchema } from '../src/middleware/schemas.js';

test('health endpoint responds without a database connection', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('task validation accepts supported statuses and rejects unknown ones', () => {
  assert.equal(taskCreateSchema.safeParse({ title: 'Write tests', status: 'In Progress' }).success, true);
  assert.equal(taskUpdateSchema.safeParse({ status: 'Blocked' }).success, false);
});