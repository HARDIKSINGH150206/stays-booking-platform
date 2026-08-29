import { jest } from "@jest/globals";
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

const appServiceMock = {
  getHello: jest.fn<() => Promise<string>>().mockResolvedValue('Hello World!'),
};

  beforeEach(() => {
    appController = new AppController(appServiceMock as any);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      await expect(appController.getHello()).resolves.toBe('Hello World!');
    });
  });
});
