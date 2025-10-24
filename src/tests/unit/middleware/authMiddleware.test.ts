import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../../middleware/auth';

describe('authMiddleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;
  let token: any = 'valid-token';
  beforeEach(() => {
    req = {
      headers: { 'x-auth-token': token },
      body: { data: 'some data' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return 500 if an error occurs', () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });
    authMiddleware(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('server error');
  });
  it('should return', () => {
    token = 'valid-token';
    const decodedData = { id: 'user1' };
    jest.spyOn(jwt, 'verify').mockReturnValue(decodedData as any);
    authMiddleware(req, res, next);
    expect(req.user).toBe(decodedData.id);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    req.headers = {};
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Access denied. No token provided.');
  });
});
