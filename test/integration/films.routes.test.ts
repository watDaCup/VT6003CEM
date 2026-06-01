import request from 'supertest';
import { encodeBasicAuth } from '../setup/test-setup';

describe('Films routes', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('GET /api/v1/films returns film list', async () => {
    jest.doMock('../../src/model/films', () => ({
      getAllFilms: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Film' }])
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback()).get('/api/v1/films');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: 'Test Film' }]);
  });

  it('GET /api/v1/films/:id returns film by id', async () => {
    jest.doMock('../../src/model/films', () => ({
      getFilmById: jest.fn().mockResolvedValue([{ id: 2, title: 'Found' }])
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback()).get('/api/v1/films/2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 2, title: 'Found' });
  });

  it('GET /api/v1/films/:id returns 404 when missing', async () => {
    jest.doMock('../../src/model/films', () => ({
      getFilmById: jest.fn().mockResolvedValue([])
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback()).get('/api/v1/films/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Not found' });
  });

  it('POST /api/v1/films requires admin auth', async () => {
    jest.doMock('../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 1, username: 'u', password: 'p', role: 'User' }])
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .post('/api/v1/films')
      .set('Authorization', encodeBasicAuth('u','p'))
      .send({ title: 'New' });
    expect(res.status).toBe(403);
  });

  it('POST /api/v1/films allows admin to create a film', async () => {
    jest.doMock('../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 1, username: 'admin', password: 'admin', role: 'Admin' }])
    }));
    jest.doMock('../../src/model/films', () => ({
      addFilm: jest.fn().mockResolvedValue({ insertId: 10 })
    }));
    const { default: app } = require('../../src/index');
    const res = await request(app.callback())
      .post('/api/v1/films')
      .set('Authorization', encodeBasicAuth('admin','admin'))
      .send({ title: 'New' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Film created');
    expect(res.body.result).toEqual({ insertId: 10 });
  });
});
