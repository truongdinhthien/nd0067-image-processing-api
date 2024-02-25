import request from './helpers/mock-request';

describe('Test home endpoint responses', () => {
  it('should return status code 200', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
  });

  it('should redirect from / to the /api route', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/api');
  });
});
