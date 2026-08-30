import { jest } from '@jest/globals';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const jwtServiceMock = {
    verifyAsync: jest.fn<(token: string) => Promise<unknown>>(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new JwtAuthGuard(jwtServiceMock as unknown as JwtService);
  });

  function createContext(authorization?: string) {
    const request = {
      headers: {
        authorization,
      },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  }

  it('should reject a request without an authorization header', async () => {
    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject a non-Bearer authorization header', async () => {
    await expect(
      guard.canActivate(createContext('Basic some-token')),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject an empty Bearer token', async () => {
    await expect(
      guard.canActivate(createContext('Bearer   ')),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject an invalid JWT', async () => {
    jwtServiceMock.verifyAsync.mockRejectedValue(new Error('invalid token'));

    await expect(
      guard.canActivate(createContext('Bearer invalid-token')),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('invalid-token');
  });

  it('should reject a JWT without required claims', async () => {
    jwtServiceMock.verifyAsync.mockResolvedValue({
      sub: 'user-1',
    });

    await expect(
      guard.canActivate(createContext('Bearer incomplete-token')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should accept a valid JWT and attach the payload to request.user', async () => {
    const payload = {
      sub: 'user-1',
      email: 'hardik@example.com',
    };

    jwtServiceMock.verifyAsync.mockResolvedValue(payload);

    const request = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('valid-token');

    expect(request).toHaveProperty('user', payload);
  });
});
