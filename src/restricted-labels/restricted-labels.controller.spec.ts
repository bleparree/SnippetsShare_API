import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsController } from './restricted-labels.controller';
import { RestrictedLabelsService } from './restricted-labels.service';
import supertest from 'supertest'; 'supertest';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';

describe('RestrictedLabelsController', () => {
  let controller: RestrictedLabelsController;
  let app: INestApplication;
  let restrictedLabelsService = new RestrictedLabelsService(null);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestrictedLabelsController],
      providers: [RestrictedLabelsService],
    })
    .overrideProvider(RestrictedLabelsService).useValue(restrictedLabelsService)
    .compile();

    controller = module.get<RestrictedLabelsController>(RestrictedLabelsController);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRestrictedLabels test case', () => {
    it("Call with or without param should return 200", async () => {
      const mock = jest.spyOn(restrictedLabelsService, 'getRestrictedLabels');
      mock.mockImplementation((name?:string, type?:string) => { 
        return new Promise((resolve, reject) => { 
          resolve([{ id: 'erjhn5zr4th2rt', name: 'gerg', type: 'Code'}, { id: 'erjhn5zze44th2rt', name: 'Tada', type: 'Repository'}])
        }); 
      });

      await supertest(app.getHttpServer()).get(`/restricted-labels`).expect(200)
        .then((res) => {
            expect(res.body[0].id).toBe("erjhn5zr4th2rt");
            expect(res.body[0].name).toBe("gerg");
            expect(res.body[0].type).toBe("Code");
        });

      await supertest(app.getHttpServer()).get(`/restricted-labels?name=titi&type=toto`).expect(200)
        .then((res) => {
            expect(res.body[0].id).toBe("erjhn5zr4th2rt");
            expect(res.body[0].name).toBe("gerg");
            expect(res.body[0].type).toBe("Code");
        });

      await supertest(app.getHttpServer()).get(`/restricted-labels?type=toto`).expect(200)
        .then((res) => {
            expect(res.body[0].id).toBe("erjhn5zr4th2rt");
            expect(res.body[0].name).toBe("gerg");
            expect(res.body[0].type).toBe("Code");
        });

      await supertest(app.getHttpServer()).get(`/restricted-labels?name=toto`).expect(200)
        .then((res) => {
            expect(res.body[0].id).toBe("erjhn5zr4th2rt");
            expect(res.body[0].name).toBe("gerg");
            expect(res.body[0].type).toBe("Code");
        });
    });
    
    it("Call without db should return a 500", async () => {
      const mock = jest.spyOn(restrictedLabelsService, 'getRestrictedLabels');
      mock.mockImplementation((name?:string, type?:string) => { 
        throw new InternalServerErrorException('pas content');
      });

      await supertest(app.getHttpServer()).get(`/restricted-labels`).expect(500).then((res) => {
        expect(res.body.error).toBe('Internal Server Error');
        expect(res.body.message).toBe('pas content')
      });
    });
  });
});
