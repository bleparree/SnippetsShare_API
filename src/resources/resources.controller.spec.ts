import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import supertest from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [ResourcesService],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRestrictedLabelTypes test cases', () => {
    it('Call should return a 200', () => {
      supertest(app.getHttpServer()).get('/resources/restrictedLabelTypes').expect(200).then((res) => {
        expect(res.body.length).toBe(3);
      });
    });
  });

  describe('getUserRoles test cases', () => {
    it('Call should return a 200',async () => {
      await supertest(app.getHttpServer()).get('/resources/userRoles').expect(200).then((res) => {
        expect(res.body.length).toBe(2);
      });
    });
  });

  describe('getUserStatus test cases', () => {
    it('Call should return a 200', () => {
      supertest(app.getHttpServer()).get('/resources/userStatus').expect(200).then((res) => {
        expect(res.body.length).toBe(4);
      });
    });
  });
});
