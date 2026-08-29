import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StaysService } from './stays.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StaysService', () => {
  let service: StaysService;

  const prismaMock = {
    stay: {
      findMany: jest.fn<() => Promise<unknown[]>>(),
      count: jest.fn<() => Promise<number>>(),
      findUnique: jest.fn<() => Promise<unknown>>(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaysService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<StaysService>(StaysService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated stays', async () => {
    prismaMock.stay.findMany.mockResolvedValue([
      {
        id: '1',
        name: 'Forest Retreat',
      },
    ]);
    prismaMock.stay.count.mockResolvedValue(5);

    const result = await service.findAll({
      page: 2,
      limit: 2,
    });

    expect(result.data).toHaveLength(1);
    expect(result.pagination).toEqual({
      page: 2,
      limit: 2,
      total: 5,
      totalPages: 3,
    });

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: 'desc' },
      skip: 2,
      take: 2,
    });
  });

  it('should filter by city', async () => {
    prismaMock.stay.findMany.mockResolvedValue([]);
    prismaMock.stay.count.mockResolvedValue(0);

    await service.findAll({
      city: 'Goa',
      page: 1,
      limit: 20,
    });

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          city: {
            equals: 'Goa',
            mode: 'insensitive',
          },
        },
      }),
    );
  });

  it('should filter by state', async () => {
    prismaMock.stay.findMany.mockResolvedValue([]);
    prismaMock.stay.count.mockResolvedValue(0);

    await service.findAll({
      state: 'Karnataka',
      page: 1,
      limit: 20,
    });

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          state: {
            equals: 'Karnataka',
            mode: 'insensitive',
          },
        },
      }),
    );
  });

  it('should filter by guest capacity', async () => {
    prismaMock.stay.findMany.mockResolvedValue([]);
    prismaMock.stay.count.mockResolvedValue(0);

    await service.findAll({
      guests: 5,
      page: 1,
      limit: 20,
    });

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          maxGuests: {
            gte: 5,
          },
        },
      }),
    );
  });

  it('should combine filters', async () => {
    prismaMock.stay.findMany.mockResolvedValue([]);
    prismaMock.stay.count.mockResolvedValue(0);

    await service.findAll({
      city: 'Goa',
      state: 'Goa',
      guests: 4,
      page: 1,
      limit: 20,
    });

    expect(prismaMock.stay.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          city: {
            equals: 'Goa',
            mode: 'insensitive',
          },
          state: {
            equals: 'Goa',
            mode: 'insensitive',
          },
          maxGuests: {
            gte: 4,
          },
        },
      }),
    );
  });

  it('should return a stay by id', async () => {
    const stay = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Forest Retreat',
    };

    prismaMock.stay.findUnique.mockResolvedValue(stay);

    const result = await service.findOne(stay.id);

    expect(result).toEqual(stay);
    expect(prismaMock.stay.findUnique).toHaveBeenCalledWith({
      where: { id: stay.id },
    });
  });

  it('should throw NotFoundException when stay does not exist', async () => {
    prismaMock.stay.findUnique.mockResolvedValue(null);

    await expect(
      service.findOne('does-not-exist'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
