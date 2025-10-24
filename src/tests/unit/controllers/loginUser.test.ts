import { createUser, loginUser } from '../../../controllers/userController';
import { User } from '../../../models/user';
import bcrypt from 'bcrypt';

describe('loginUser', () => {
  let req: any;
  let res: any;
  let user: any;

  beforeEach(() => {
    req = {
      body: {
        email: 'example@gmail.com',
        password: 'Password1',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      header: jest.fn().mockReturnThis(),
    };
    user = {
      email: 'user@gmail.com',
      password: '$2b$10$KIXQJY1jE6Z0F8E6Z0F8E6Z0F8E6Z0F8E6Z0F8E6Z0F8E6Z0F8E6', // hashed 'Password1'
      generateAuthToken: jest.fn().mockReturnValue('valid-token'),
    };
    jest.clearAllMocks();
  });

  it('should return 400 if user is not found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid email or password');
  });

  it('should return 403 if password is incorrect', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(async () => false as boolean);
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Invalid email or password');
  });

  it('should return token if login is successful', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(async () => true as boolean);
    await loginUser(req, res);
    expect(res.header).toHaveBeenCalledWith('x-auth-token', 'valid-token');
    expect(res.send).toHaveBeenCalledWith('valid-token');
  });

  it('should return 500 on server error', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('DB error'));
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: new Error('DB error') });
  });
});

describe('sign-up user', () => {
  let req: any;
  let res: any;
  let user: any;
  beforeEach(() => {
    user = {
      name: 'user1',
      email: 'example@gmail.com',
      password: 'Password1',
    };
    req = {
      body: user,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      header: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it('should return 400 if user already exists', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(user);
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('User already registered');
  });
  it('should return 200 if user is created successfully', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(User.prototype, 'save').mockResolvedValueOnce(undefined);
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: 'User registered successfully',
    });
  });
});
