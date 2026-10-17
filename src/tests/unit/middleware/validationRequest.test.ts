import * as validateHelpers from '../../../helpers/validationHelpers';
import { validateRequest } from '../../../middleware/validation';

describe('validateRequest', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
      user: '',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('user validation', () => {
    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'Password1',
        },
      };
    });
    it('should call next() for valid login data', () => {
      const middleware = validateRequest('user');
      req.path = '/login';
      middleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
    it('should return 400 for invalid login data', () => {
      const middleware = validateRequest('user');
      req.path = '/login';
      req.body.password = 'short';
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
    it('should call next() for valid signup data', () => {
      const middleware = validateRequest('user');
      req.path = '/signup';
      req.body.name = 'Test User';
      middleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
    it('should return 400 for invalid signup data', () => {
      const middleware = validateRequest('user');
      req.path = '/signup';
      req.body.email = 'invalid-email';
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });
  describe('blog validation', () => {
    beforeEach(() => {
      req.path = '/blogs';
      req.body = {
        title: 'Valid Title',
        content: 'This is valid content for the blog post.',
        category: 'Technology',
      };
    });

    it('should call next() for valid blog data', () => {
      jest
        .spyOn(validateHelpers, 'blogValidate')
        .mockReturnValue({ error: null } as any);

      const middleware = validateRequest('blog');
      middleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
    it('should return 400 for invalid blog data', () => {
      jest.spyOn(validateHelpers, 'blogValidate').mockReturnValue({
        error: { details: [{ message: 'Invalid blog data' }] },
      } as any);

      const middleware = validateRequest('blog');
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid blog data');
    });
  });
});
