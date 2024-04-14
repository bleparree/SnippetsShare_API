import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsController } from './restricted-labels.controller';
import { RestrictedLabelsService } from './restricted-labels.service';
import supertest from 'supertest'; 'supertest';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { addRestrictedLabel } from './dto/addRestrictedLabel.dto';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';

describe('RestrictedLabelsController', () => {
  let controller: RestrictedLabelsController;
  let app: INestApplication;
  let restrictedLabelsService = new RestrictedLabelsService(null);
  const mockRestrictedLabelList: RestrictedLabel[] = [
    { id: 'erjhn5zr4th2rt', name: 'gerg', type: 'Code'}, 
    { id: 'erjhn5zze44th2rt', name: 'Tada', type: 'Repository'}
  ];
  let usedRestrictedLabelList: RestrictedLabel[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestrictedLabelsController],
      providers: [RestrictedLabelsService],
    })
    .overrideProvider(RestrictedLabelsService).useValue(restrictedLabelsService)
    .compile();

    usedRestrictedLabelList = mockRestrictedLabelList;
    controller = module.get<RestrictedLabelsController>(RestrictedLabelsController);
    app = module.createNestApplication();
    await app.init();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRestrictedLabels test cases', () => {
    const mock = jest.spyOn(restrictedLabelsService, 'getRestrictedLabels');
    mock.mockImplementation((name?:string, type?:string) => { 
      return new Promise((resolve, reject) => { 
        resolve(usedRestrictedLabelList)
      }); 
    });
    it("Call without param should return 200", async () => {
      await getrestrictedLabelSuperTest(`/restricted-labels`, usedRestrictedLabelList);
    });
    it("Call with both params should return 200", async () => {
      await getrestrictedLabelSuperTest(`/restricted-labels?name=titi&type=toto`, usedRestrictedLabelList);
    });
    it("Call only with type should return 200 and the available datas", async () => {
      await getrestrictedLabelSuperTest(`/restricted-labels?type=toto`, usedRestrictedLabelList);
    });
    it("Call only with name should return 200", async () => {
      await getrestrictedLabelSuperTest(`/restricted-labels?name=toto`, usedRestrictedLabelList);
    });
    mock.mockClear();
    it("Call without db should return a 500", async () => {
      const mock500 = jest.spyOn(restrictedLabelsService, 'getRestrictedLabels');
      mock500.mockImplementation((name?:string, type?:string) => { 
        throw new InternalServerErrorException('pas content');
      });
      await supertest(app.getHttpServer()).get(`/restricted-labels`).expect(500).then((res) => {
        expect(res.body.error).toBe('Internal Server Error');
        expect(res.body.message).toBe('pas content')
      });
      mock500.mockClear();
    });
  });

  describe('addRestrictedLabel test cases', () => {
    const returnId = 'eheh54ererh1541er';
    const mock = jest.spyOn(restrictedLabelsService, 'addRestrictedLabel');
    mock.mockImplementation((entity:addRestrictedLabel) => { 
      return new Promise((resolve, reject) => { 
        resolve(returnId);
      }); 
    });

    it('Call with a correct entity should return a 201', async () => {
      await supertest(app.getHttpServer()).post('/restricted-labels').send({name: 'test2', type: 'Code'}).set('Content-Type', 'application/json').set('Accept', 'application/json')
       .expect(201)
        .then((res) => {
          expect(res.text).toBe(returnId);
        })
    });
    it('Call without entity should return a 400', async () => {
      await supertest(app.getHttpServer()).post('/restricted-labels').expect(400);
    });
    it('Call with a wrong entity should return a 400', async () => {
      await supertest(app.getHttpServer()).post('/restricted-labels').send({name: 21, type: 'Code'}).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400);
    });

    mock.mockClear();
    
    it("Call without db should return a 500", async () => {
      const mock500 = jest.spyOn(restrictedLabelsService, 'addRestrictedLabel');
      mock500.mockImplementation((entity:addRestrictedLabel) => { 
        throw new InternalServerErrorException('pas content');
      });
      await supertest(app.getHttpServer()).post(`/restricted-labels`).send({name: 'test2', type: 'Code'}).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(500).then((res) => {
          expect(res.body.error).toBe('Internal Server Error');
          expect(res.body.message).toBe('pas content')
        });
      mock500.mockClear();
    });
  });

  describe('updateRestrictedLabel test cases', () => {
    const returnLabel:updateRestrictedLabel = { id: 'szerhg6514reh981erh', name: 'Test' };
    const mock = jest.spyOn(restrictedLabelsService, 'updateRestrictedLabel');
    mock.mockImplementation((id:string, name:string) => { 
      return new Promise((resolve, reject) => { 
        resolve(returnLabel);
      }); 
    });

    it('Call with a correct entity should return a 200', async () => {
      await supertest(app.getHttpServer()).put(`/restricted-labels/${returnLabel.id}?name=${returnLabel.name}`)
       .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(returnLabel.id);
          expect(res.body.name).toBe(returnLabel.name);
        })
    });
    it('Call without id should return a 404', async () => {
      await supertest(app.getHttpServer()).put(`/restricted-labels?name=${returnLabel.name}`).expect(404);
    });
    it('Call without name should return a 400', async () => {
      await supertest(app.getHttpServer()).put(`/restricted-labels/${returnLabel.id}`).expect(400);
    });
    mock.mockClear();
    
    it("Call without db should return a 500", async () => {
      const mock500 = jest.spyOn(restrictedLabelsService, 'updateRestrictedLabel');
      mock500.mockImplementation((id:string, name:string) => { 
        throw new InternalServerErrorException('pas content');
      });
      await supertest(app.getHttpServer()).put(`/restricted-labels/${returnLabel.id}?name=${returnLabel.name}`)
        .expect(500).then((res) => {
          expect(res.body.error).toBe('Internal Server Error');
          expect(res.body.message).toBe('pas content')
        });
      mock500.mockClear();
    });
  });

  describe('deleteRestrictedLabel test cases', () => {
    const mock = jest.spyOn(restrictedLabelsService, 'deleteRestrictedLabel');
    mock.mockImplementation((id:string) => { return new Promise((resolve) => { resolve(); }); });

    it('Call with a correct id should return a 204', async () => {
      await supertest(app.getHttpServer()).delete('/restricted-labels/erg654erg1erg').expect(204);
    });
    it('Call without id should return a 404', async () => {
      await supertest(app.getHttpServer()).delete('/restricted-labels').expect(404);
    });
    mock.mockClear();

    it("Call without db should return a 500", async () => {
      const mock500 = jest.spyOn(restrictedLabelsService, 'deleteRestrictedLabel');
      mock500.mockImplementation((id:string) => { 
        throw new InternalServerErrorException('pas content');
      });
      await supertest(app.getHttpServer()).delete(`/restricted-labels/erg654erg1erg`)
        .expect(500).then((res) => {
          expect(res.body.error).toBe('Internal Server Error');
          expect(res.body.message).toBe('pas content')
        });
      mock500.mockClear();
    });
  });

  describe('getRestrictedLabelTypes test cases', () => {
    it('Call with a correct id should return a 200', () => {
      supertest(app.getHttpServer()).get('/restricted-labels/types').expect(200).then((res) => {
        expect(res.body.length).toBe(3);
      });
    });
  });
  
  async function getrestrictedLabelSuperTest(apiCall:string, checkRes:RestrictedLabel[]) {
    await supertest(app.getHttpServer()).get(apiCall).expect(200)
      .then((res) => {
          expect(res.body[0].id).toBe(checkRes[0].id);
          expect(res.body[0].name).toBe(checkRes[0].name);
          expect(res.body[0].type).toBe(checkRes[0].type);
      });
  }
});
