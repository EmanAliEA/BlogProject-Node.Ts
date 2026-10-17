import { checkOwnership } from '../../../middleware/ownerShip';
import * as blogController from '../../../controllers/blogController';
describe('checkOwnership Middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;
  let blog: any;
  beforeEach(() => {
    blog = {
      user_id: 'ownerUserId',
    };
    req = {
      user: { id: 'requestingUserId' },
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
  it('return 403 if user is not the owner', async () => {
    jest.spyOn(blogController, 'getBlogById').mockResolvedValueOnce(blog);
    await checkOwnership(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(
      'you are not allowed to delete/update this blog'
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user is the owner', async () => {
    // Setup
    blog.user_id = 'requestingUserId';

    jest.spyOn(blogController, 'getBlogById').mockImplementation(() => {
      return blog;
    });
    await checkOwnership(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
