import request from './helpers/mock-request';

describe('Test home API', () => {
  describe('GET /', () => {
    it('should redirect to the /api route', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/api');
    });
  });

  describe('GET /api', () => {
    it('should return status code 200', async () => {
      const response = await request.get('/api');
      expect(response.status).toBe(200);
    });
  });
});
