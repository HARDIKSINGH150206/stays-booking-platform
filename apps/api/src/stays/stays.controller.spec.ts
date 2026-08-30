import { jest } from '@jest/globals';
import { StaysController } from './stays.controller';

describe('StaysController', () => {
  let controller: StaysController;

  const staysServiceMock = {
    findAll: jest.fn<() => Promise<unknown>>(),
    findOne: jest.fn<() => Promise<unknown>>(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new StaysController(staysServiceMock as any);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate findAll to the service', async () => {
    const query = {
      city: 'Goa',
      page: 1,
      limit: 20,
    };

    const response = {
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };

    staysServiceMock.findAll.mockResolvedValue(response);

    await expect(controller.findAll(query)).resolves.toEqual(response);

    expect(staysServiceMock.findAll).toHaveBeenCalledWith(query);
  });

  it('should delegate findOne to the service', async () => {
    const id = '11111111-1111-4111-8111-111111111111';

    const stay = {
      id,
      name: 'Forest Retreat',
    };

    staysServiceMock.findOne.mockResolvedValue(stay);

    await expect(controller.findOne(id)).resolves.toEqual(stay);

    expect(staysServiceMock.findOne).toHaveBeenCalledWith(id);
  });
});
