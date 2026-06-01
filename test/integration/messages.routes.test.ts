import request from 'supertest';
import { encodeBasicAuth } from '../setup/test-setup';

describe('Messages routes', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('POST /api/v1/messages sends a message when admin exists', async () => {
    jest.doMock('../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 9, username: 'user', password: 'pw', role: 'User' }]),
      getAdminUser: jest.fn().mockResolvedValue({ id: 1 })
    }));
    jest.doMock('../../src/model/messages', () => ({
      sendMessage: jest.fn().mockResolvedValue({ insertId: 15 })
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .post('/api/v1/messages')
      .set('Authorization', encodeBasicAuth('user','pw'))
      .send({ text: 'Hello' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Message sent', result: { insertId: 15 } });
  });

  it('GET /api/v1/messages requires admin role', async () => {
    jest.doMock('../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 10, username: 'user2', password: 'pw', role: 'User' }])
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .get('/api/v1/messages')
      .set('Authorization', encodeBasicAuth('user2','pw'));
    expect(res.status).toBe(403);
  });

  it('GET /api/v1/messages returns all messages for admin', async () => {
    jest.doMock('../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 11, username: 'admin', password: 'pw', role: 'Admin' }])
    }));
    jest.doMock('../../src/model/messages', () => ({
      getMessagesForAdmin: jest.fn().mockResolvedValue([{ id: 1, text: 'msg' }])
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .get('/api/v1/messages')
      .set('Authorization', encodeBasicAuth('admin','pw'));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, text: 'msg' }]);
  });
});
