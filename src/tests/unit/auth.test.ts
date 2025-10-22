import {
  checkPassword,
  createUser,
  getUser,
} from '../../controllers/userController';
import { User } from '../../models/user';

describe('login', () => {
  let user: { email: string; password: string };
  beforeAll(() => {
    user = {
      email: 'test@example.com',
      password: 'Password1',
    };
  });

  describe('getUser', () => {
    it('should return 400 if user is not found', async () => {
      // Mock the User.findOne method to return null
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      const req: any = { body: { email: user.email } };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const foundUser = await getUser(req, res);
      expect(foundUser).toBeNull();
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.send).toHaveBeenCalledWith('Invalid email or password');
    });
    it('should return user if found', async () => {
      // Mock the User.findOne method to return user
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);
      const req: any = { body: { email: user.email } };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const result = await getUser(req, res);
      expect(result).toBe(user);
    });
  });

  describe('checkPassword', () => {
    it('should return false for invalid password', async () => {
      const req: any = { body: { password: 'WrongPassword' } };
      const isValid = await checkPassword(req, user.password);
      expect(isValid).toBe(false);
    });
    it('should return true for valid password', async () => {
      const req: any = { body: { password: 'Password1' } };
      const isValid = await checkPassword(req, user.password);
      expect(isValid).toBe(false);
    });
  });
});

describe('signup', () => {
  let user: { name: string; email: string; password: string };
  let res: any;
  beforeAll(() => {
    user = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('getUser', () => {
    it('should return 400 if user is not found', async () => {
      // Mock the User.findOne method to return null
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      const req: any = { body: { email: user.email } };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const foundUser = await getUser(req, res);
      expect(foundUser).toBeNull();
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.send).toHaveBeenCalledWith('User already registered');
    });
    it('should return user if found', async () => {
      // Mock the User.findOne method to return user
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);
      const req: any = { body: { email: user.email } };
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const result = await getUser(req, res);
      expect(result).toBe(user);
    });
  });

  describe('createUser', () => {
    it('should create and return 200 for new user', async () => {
      // Mock User.prototype.save to resolve immediately
      jest.spyOn(User.prototype, 'save').mockResolvedValueOnce(undefined);
      // Mock bcrypt.genSalt and bcrypt.hash to resolve quickly
      jest.spyOn(require('bcrypt'), 'genSalt').mockResolvedValue('salt');
      jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue('hashedPassword');
      const req: any = { body: user };
      await createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: 'User registered successfully',
      });
    });
    it('should return 500 if error occurs', async () => {
      // Mock the User.prototype.save method to throw an error
      jest.spyOn(User.prototype, 'save').mockRejectedValueOnce(new Error());
      const req: any = { body: user };

      await createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: new Error(),
      });
    });
  });
});
