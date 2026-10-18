import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../../modules/auth/dto/login.dto';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';

describe('NormalizeEmail', () => {
  it('trims and lowercases, including on PartialType update DTOs', () => {
    expect(plainToInstance(LoginDto, { email: ' Jane@X.COM ' }).email).toBe('jane@x.com');
    expect(plainToInstance(UpdateUserDto, { email: 'Jane@X.com' }).email).toBe('jane@x.com');
  });
});
