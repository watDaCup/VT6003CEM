import request from 'supertest';

describe('CinemaVault API Integration Tests', () => {
  // Mock credentials for Basic Authentication
  const apiURL = 'http://127.0.0.1:10888';
  const adminAuth = 'Basic ' + Buffer.from('admin:adminpass').toString('base64');
  const userAuth = 'Basic ' + Buffer.from('alice:alice123').toString('base64');

  // ==========================================
  // 1. FILMS ENDPOINTS
  // ==========================================
  describe('GET /api/v1/films', () => {
    it('should browse and filter films with query parameters', async () => {
      const response = await request(apiURL)
        .get('/api/v1/films')
        .query({ title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.5 })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title');
      }
    });
  });

  describe('POST /api/v1/films', () => {
    it('should allow Admin to create a film successfully', async () => {
      const newFilm = {
        title: 'Interstellar',
        genre: 'Sci-Fi',
        year: 2014,
        rating: 8.6,
        description: 'A team of explorers travel through a wormhole in space.'
      };

      const response = await request(apiURL)
        .post('/api/v1/films')
        .set('Authorization', adminAuth)
        .send(newFilm)
        .expect(201);
    });
  });

  describe('GET /api/v1/films/{id}', () => {
    it('should return film details for a valid ID', async () => {
      const filmId = 1;
      const response = await request(apiURL)
        .get(`/api/v1/films/${filmId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', filmId);
    });

    it('should return 404 for a non-existent film ID', async () => {
      await request(apiURL)
        .get('/api/v1/films/99999')
        .expect(404);
    });
  });

  // ==========================================
  // 2. USERS ENDPOINTS
  // ==========================================
  describe('POST /api/v1/users', () => {
    it('should successfully sign up a user account', async () => {
      const signupPayload = {
        username: 'new_viewer',
        password: 'securePassword123',
        role: 'User',
        email: 'viewer@example.com'
      };

      const response = await request(apiURL)
        .post('/api/v1/users')
        .send(signupPayload)
        .expect(201);
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should authenticate with valid basic credentials', async () => {
      await request(apiURL)
        .post('/api/v1/users/login')
        .set('Authorization', userAuth)
        .expect(200);
    });
  });

  describe('POST /api/v1/users/{id}/photo', () => {
    it('should upload a base64-encoded profile photo', async () => {
      const photoPayload = {
        filename: 'avatar.png',
        data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      };

      await request(apiURL)
        .post('/api/v1/users/2/photo')
        .set('Authorization', userAuth)
        .send(photoPayload)
        .expect(200);
    });
  });

  describe('Favorites Management', () => {
    it('should add a film to a user\'s favorites', async () => {
      await request(apiURL)
        .post('/api/v1/users/2/favorites/3')
        .set('Authorization', userAuth)
        .send({ filmId: 10 })
        .expect(200);
    });

    it('should list a user\'s favorite films', async () => {
      const response = await request(apiURL)
        .get('/api/v1/users/2/favorites')
        .set('Authorization', userAuth)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should remove a film from favorites', async () => {
      await request(apiURL)
        .delete('/api/v1/users/2/favorites/3')
        .set('Authorization', userAuth)
        .expect(200);
    });
  });

  // ==========================================
  // 3. MESSAGES ENDPOINTS
  // ==========================================
  describe('Messages Management', () => {
    let sampleMessageId = 101;

    it('should allow user to send a message to the administrator', async () => {
      const messagePayload = {
        film_id: 3,
        text: 'The metadata for this film has a typo in the description.'
      };

      await request(apiURL)
        .post('/api/v1/messages')
        .set('Authorization', userAuth)
        .send(messagePayload)
        .expect(201);
    });

    it('should allow admin to list all messages', async () => {
      const response = await request(apiURL)
        .get('/api/v1/messages')
        .set('Authorization', adminAuth)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow admin to respond to a message', async () => {
      const responsePayload = {
        response: 'Thank you for flagging this. We have updated the film summary!'
      };

      await request(apiURL)
        .post(`/api/v1/messages/${sampleMessageId}/respond`)
        .set('Authorization', adminAuth)
        .send(responsePayload)
        .expect(200);
    });

    it('should allow admin to delete a message', async () => {
      await request(apiURL)
        .delete(`/api/v1/messages/${sampleMessageId}`)
        .set('Authorization', adminAuth)
        .expect(200);
    });
  });
});