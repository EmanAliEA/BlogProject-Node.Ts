import { userValidate } from '../../models/user';

describe('login', () => {
  describe('userValidate', () => {
    it('should return error if email or password is missing ', () => {
      const missPass = userValidate(
        { email: 'valid@email.com', password: '' },
        true
      );
      const missEmail = userValidate(
        { email: '', password: 'Password1' },
        false
      );

      expect(missPass.error).toBeDefined();
      expect(missEmail.error).toBeDefined();
    });
    it('should return error if email or password is not valid ', () => {
      const result = userValidate(
        { email: 'invalidEmail', password: 'Password1' },
        true
      );
      const result2 = userValidate(
        { email: 'valid@example.com', password: 'Password' },
        true
      );
      expect(result.error).toBeDefined();
      expect(result2.error).toBeDefined();
    });
    it('should not return error if email and password are valid ', () => {
      const result = userValidate(
        {
          email: 'valid@example.com',
          password: 'Password1',
        },
        true
      );
      expect(result.error).toBeUndefined();
    });
  });
});

describe('signup', () => {
  describe('userValidate', () => {
    it('should return error if email or password or name is not valid ', () => {
      const invalidEmail = userValidate(
        { name: 'user', email: 'invalidEmail', password: 'Password1' },
        false
      );
      const invalidName = userValidate(
        { name: 'abc', email: 'valid@example.com', password: 'Password1' },
        false
      );
      const invalidPass = userValidate(
        { name: 'user', email: 'valid@example.com', password: 'Password' },
        false
      );
      expect(invalidEmail.error).toBeDefined();
      expect(invalidName.error).toBeDefined();
      expect(invalidPass.error).toBeDefined();
    });
    it('should return error if email or password or is missing ', () => {
      const missPass = userValidate(
        { name: 'user', email: 'valid@email.com', password: '' },
        false
      );
      const missEmail = userValidate(
        { name: 'user', email: '', password: 'Password1' },
        false
      );
      const missName = userValidate(
        { name: '', email: 'valid@email.com', password: 'Password1' },
        false
      );

      expect(missPass.error).toBeDefined();
      expect(missEmail.error).toBeDefined();
      expect(missName.error).toBeDefined();
    });
  });
});
