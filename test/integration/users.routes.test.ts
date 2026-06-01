import request from 'supertest';
import { encodeBasicAuth } from '../setup/test-setup';

describe('Users routes', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('POST /api/v1/users creates a new user', async () => {
    jest.doMock('../../src/model/users', () => ({
      createUser: jest.fn().mockResolvedValue({ insertId: 5 })
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({ username: 'newuser', password: 'pass', role: 'User' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'User created', result: { insertId: 5 } });
  });

  it('POST /api/v1/users/login authenticates valid credentials', async () => {
    jest.doMock('../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 7, username: 'login', password: 'pw', role: 'User' }])
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .post('/api/v1/users/login')
      .set('Authorization', encodeBasicAuth('login','pw'));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Authenticated', user: { id: 7, username: 'login', role: 'User' } });
  });

  it('POST /api/v1/users/:id/favorites adds a favorite for the owner', async () => {
    jest.doMock('../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 8, username: 'favuser', password: 'pw', role: 'User' }])
    }));
    jest.doMock('../../src/model/favorites', () => ({
      addFavorite: jest.fn().mockResolvedValue({ affectedRows: 1 })
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .post('/api/v1/users/8/favorites')
      .set('Authorization', encodeBasicAuth('favuser','pw'))
      .send({ filmId: 20 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Added to favorites' });
  });
});
