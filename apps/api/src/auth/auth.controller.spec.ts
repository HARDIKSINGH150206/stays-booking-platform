import { jest } from '@jest/globals';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: jest.fn<(dto: unknown) => Promise<unknown>>(),
    login: jest.fn<(dto: unknown) => Promise<unknown>>(),
    getCurrentUser: jest.fn<(userId: string) => Promise<unknown>>(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new AuthController(authServiceMock as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate registration to the service', async () => {
    const dto = {
      name: 'Hardik Singh',
      email: 'hardik@example.com',
      password: 'Password123!',
    };

    const response = {
      id: 'user-1',
      name: 'Hardik Singh',
      email: 'hardik@example.com',
      createdAt: new Date('2026-08-30T00:00:00.000Z'),
    };

    authServiceMock.register.mockResolvedValue(response);

    await expect(controller.register(dto)).resolves.toEqual(response);

    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
  });

  it('should delegate login to the service', async () => {
    const dto = {
      email: 'hardik@example.com',
      password: 'Password123!',
    };

    const response = {
      accessToken: 'jwt-token',
      user: {
        id: 'user-1',
        name: 'Hardik Singh',
        email: 'hardik@example.com',
      },
    };

    authServiceMock.login.mockResolvedValue(response);

    await expect(controller.login(dto)).resolves.toEqual(response);

    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
  });

  it('should delegate current-user lookup using the authenticated user id', async () => {
    const user = {
      sub: 'user-1',
      email: 'hardik@example.com',
    };

    const response = {
      id: 'user-1',
      name: 'Hardik Singh',
      email: 'hardik@example.com',
      createdAt: new Date('2026-08-30T00:00:00.000Z'),
    };

    authServiceMock.getCurrentUser.mockResolvedValue(response);

    await expect(controller.me(user)).resolves.toEqual(response);

    expect(authServiceMock.getCurrentUser).toHaveBeenCalledWith(user.sub);
  });
});
