import { loginUser } from '../../../controllers/userController';
import * as userController from '../../../controllers/userController';

jest.mock('../../../controllers/userController');

describe('loginUser', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: { email: 'testuser@example.com', password: 'Password1' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  // it('should return 400 if user is not found', async () => {
  //   (userController.getUser as jest.Mock).mockResolvedValue(null);

  //   await loginUser(req, res);
  //   expect(res.text).toBe('Invalid email or password');
  // });
  it('should return token if login is successful', async () => {
    const mockUser = {
      password: 'hashedPassword',
      generateAuthToken: jest.fn().mockReturnValue('mockToken'),
    };
    (userController.getUser as jest.Mock).mockResolvedValue(mockUser);
    (userController.checkPassword as jest.Mock).mockResolvedValue(true);

    await userController.loginUser(req, res);

    expect(res.header).toHaveBeenCalledWith('x-auth-token', 'mockToken');
    expect(res.send).toHaveBeenCalledWith('mockToken');
  });
});
