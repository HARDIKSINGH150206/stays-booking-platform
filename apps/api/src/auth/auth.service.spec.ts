import { jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const jwtServiceMock = {
    signAsync: jest.fn<(payload: unknown) => Promise<string>>(),
  };

  const prismaMock = {
    user: {
      findUnique: jest.fn<() => Promise<unknown>>(),
      create: jest.fn<(args: unknown) => Promise<unknown>>(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new AuthService(
      prismaMock as unknown as PrismaService,
      jwtServiceMock as unknown as JwtService,
    );
  });

  describe('getCurrentUser', () => {
    it('should return the authenticated user without the password hash', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Hardik Singh',
        email: 'hardik@example.com',
        createdAt: new Date('2026-08-30T00:00:00.000Z'),
      });

      await expect(service.getCurrentUser('user-1')).resolves.toEqual({
        id: 'user-1',
        name: 'Hardik Singh',
        email: 'hardik@example.com',
        createdAt: new Date('2026-08-30T00:00:00.000Z'),
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    });

    it('should reject when the authenticated user no longer exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getCurrentUser('missing-user'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('register', () => {
    const dto = {
      name: 'Hardik Singh',
      email: '  HARDIK@EXAMPLE.COM ',
      password: 'Password123!',
    };

    it('should register a new user and never return the password hash', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      prismaMock.user.create.mockResolvedValue({
        id: 'user-1',
        name: 'Hardik Singh',
        email: 'hardik@example.com',
        createdAt: new Date('2026-08-30T00:00:00.000Z'),
      });

      const result = await service.register(dto);

      expect(result).toEqual({
        id: 'user-1',
        name: 'Hardik Singh',
        email: 'hardik@example.com',
        createdAt: new Date('2026-08-30T00:00:00.000Z'),
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: 'hardik@example.com',
        },
        select: {
          id: true,
        },
      });

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Hardik Singh',
          email: 'hardik@example.com',
          passwordHash: expect.any(String),
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      const createCall = prismaMock.user.create.mock.calls[0][0] as {
        data: { passwordHash: string };
      };

      await expect(
        bcrypt.compare(dto.password, createCall.data.passwordHash),
      ).resolves.toBe(true);
    });

    it('should reject duplicate email addresses', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'existing-user',
      });

      await expect(service.register(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const dto = {
      email: '  HARDIK@EXAMPLE.COM ',
      password: 'Password123!',
    };

    const passwordHash = '$2b$10$abcdefghijklmnopqrstuuabcdefghijklmnopqrstuu';

    const user = {
      id: 'user-1',
      name: 'Hardik Singh',
      email: 'hardik@example.com',
      passwordHash,
    };

    it('should login with valid credentials and return an access token', async () => {
      const realPasswordHash = await bcrypt.hash(dto.password, 10);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        passwordHash: realPasswordHash,
      });

      jwtServiceMock.signAsync.mockResolvedValue('test-access-token');

      const result = await service.login(dto);

      expect(result).toEqual({
        accessToken: 'test-access-token',
        user: {
          id: 'user-1',
          name: 'Hardik Singh',
          email: 'hardik@example.com',
        },
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: 'hardik@example.com',
        },
        select: {
          id: true,
          name: true,
          email: true,
          passwordHash: true,
        },
      });

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'hardik@example.com',
      });
    });

    it('should reject an unknown email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });

    it('should reject an incorrect password', async () => {
      const realPasswordHash = await bcrypt.hash('DifferentPassword123!', 10);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        passwordHash: realPasswordHash,
      });

      await expect(service.login(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });

    it('should normalize the email before looking up the user', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        passwordHash: await bcrypt.hash(dto.password, 10),
      });

      jwtServiceMock.signAsync.mockResolvedValue('test-access-token');

      await service.login(dto);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            email: 'hardik@example.com',
          },
        }),
      );
    });

    it('should never expose the password hash in the response', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        passwordHash: await bcrypt.hash(dto.password, 10),
      });

      jwtServiceMock.signAsync.mockResolvedValue('test-access-token');

      const result = await service.login(dto);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });
});
