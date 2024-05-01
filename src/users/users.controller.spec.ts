import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { GetUser } from './dto/getUser.dto';
import supertest from 'supertest';
import { AddUser } from './dto/addUser.dto';
import { UpdateFullUser } from './dto/updateFullUser.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;
  let usersService = new UsersService(null);
  const mockUserList: GetUser[] = [
    { id: 'erjhn5zr4th2rt1', userName: 'User1', eMail: 'User1SnippetShare@yopmail.com', role: 'SuperAdmin', status: 'Activated'},
    { id: 'erjhn5zr4th2rt2', userName: 'User2', eMail: 'User2SnippetShare@yopmail.com', role: 'User', status: 'ToActivate'}, 
    { id: 'erjhn5zr4th2rt3', userName: 'User3', eMail: 'User3SnippetShare@yopmail.com', role: 'User', status: 'ReInitPassword'}, 
    { id: 'erjhn5zr4th2rt4', userName: 'User4', eMail: 'User4SnippetShare@yopmail.com', role: 'User', status: 'Suspended'}, 
    { id: 'erjhn5zr4th2rt5', userName: 'User5', eMail: 'User5SnippetShare@yopmail.com', role: 'User', status: 'Activated'}
  ];
  let userList: GetUser[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
    .overrideProvider(UsersService).useValue(usersService)
    .compile();

    userList = mockUserList;
    controller = module.get<UsersController>(UsersController);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser test cases', () => {
    const mock = jest.spyOn(usersService, 'getUser');
    mock.mockImplementation((id:string) => { 
      return new Promise((resolve, reject) => { 
        resolve(userList[0])
      }); 
    });
    it("Call should return 200", async () => {
      await supertest(app.getHttpServer()).get('/users/12').expect(200)
        .then((res) => {
            expect(res.body.id).toBe(userList[0].id);
            expect(res.body.eMail).toBe(userList[0].eMail);
            expect(res.body.userName).toBe(userList[0].userName);
        });
    });
  })

  describe('getUsers test cases', () => {
    const mock = jest.spyOn(usersService, 'getUsers');
    mock.mockImplementation((id:string) => { 
      return new Promise((resolve, reject) => { 
        resolve(userList)
      }); 
    });
    it("Call without param should return 200", async () => {
      await supertest(app.getHttpServer()).get('/users').expect(200)
        .then((res) => {
            expect(res.body.length).toBe(userList.length);
            expect(res.body[0].id).toBe(userList[0].id);
            expect(res.body[0].userName).toBe(userList[0].userName);
            expect(res.body[1].id).toBe(userList[1].id);
        });
    });
    it("Call with query search return 200", async () => {
      await supertest(app.getHttpServer()).get('/users?searchText=tata').expect(200)
        .then((res) => {
            expect(res.body.length).toBe(userList.length);
            expect(res.body[0].id).toBe(userList[0].id);
            expect(res.body[0].userName).toBe(userList[0].userName);
            expect(res.body[1].id).toBe(userList[1].id);
        });
    });
    it("Call with query role return 200", async () => {
      await supertest(app.getHttpServer()).get('/users?role=tata').expect(200)
        .then((res) => {
            expect(res.body.length).toBe(userList.length);
            expect(res.body[0].id).toBe(userList[0].id);
            expect(res.body[0].userName).toBe(userList[0].userName);
            expect(res.body[1].id).toBe(userList[1].id);
        });
    });
    it("Call with query status return 200", async () => {
      await supertest(app.getHttpServer()).get('/users?status=tata').expect(200)
        .then((res) => {
            expect(res.body.length).toBe(userList.length);
            expect(res.body[0].id).toBe(userList[0].id);
            expect(res.body[0].userName).toBe(userList[0].userName);
            expect(res.body[1].id).toBe(userList[1].id);
        });
    });
    it("Call with all param return 200", async () => {
      await supertest(app.getHttpServer()).get('/users?searchText=tata&role=tata&status=tata').expect(200)
        .then((res) => {
            expect(res.body.length).toBe(userList.length);
            expect(res.body[0].id).toBe(userList[0].id);
            expect(res.body[0].userName).toBe(userList[0].userName);
            expect(res.body[1].id).toBe(userList[1].id);
        });
    });
    mock.mockClear();
  })

  describe('addUser test cases', () => {
    const mock = jest.spyOn(usersService, 'addUser');
    mock.mockImplementation((user:AddUser) => { 
      return new Promise((resolve, reject) => { 
        resolve(userList[0].id);
      }); 
    });
    it("Call with a correct entity should return a 201", async () => {
      await supertest(app.getHttpServer()).post('/users')
        .send({userName: 'test2', password: 'Code', eMail: 'zihef@zef.com'}).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(201)
        .then((res) => {
            expect(res.text).toBe(userList[0].id);
        });
    });
    it("Call without entity should return a 400", async () => {
      await supertest(app.getHttpServer()).post('/users').expect(400);
    });
    it("Call with a wrong entity should return a 400", async () => {
      await supertest(app.getHttpServer()).post('/users')
        .send({password: 'Code', eMail: 'zihef@zef.com'}).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400)
        .then((res) => {
          expect(res.body.message.length).toBeGreaterThan(0);
          expect(res.body.message[0]).toContain('userName');
        });
    });
    mock.mockClear();
  })

  describe('updateUser test cases', () => {
    let updateUser:UpdateFullUser = {userName: 'test', eMail: 'test@gmail.com', role: 'User', status: 'Activated'};
    let wrongUpdateUser:UpdateFullUser = {userName: 'test', eMail: 'test@gmail.com', role: 'zegzeg', status: 'Activated'};
    const mock = jest.spyOn(usersService, 'updateUser');
    mock.mockImplementation((id: string, user:UpdateFullUser) => { 
      return new Promise((resolve, reject) => { 
        resolve(updateUser);
      }); 
    });
    it("Call with a correct entity should return a 200", async () => {
      await supertest(app.getHttpServer()).put('/users/moniddeuser')
        .send(updateUser).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(200)
        .then((res) => {
          expect(res.body.userName).toBe(updateUser.userName);
        });
    });
    it("Call without id should return a 404", async () => {
      await supertest(app.getHttpServer()).put('/users')
        .send(updateUser).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(404);
    });
    it("Call with a wrong entity should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/moniddeuser')
        .send(wrongUpdateUser).set('Content-Type', 'application/json').set('Accept', 'application/json')
        .expect(400);
    });
    mock.mockClear();
  })

  describe('updateUser_UserName test cases', () => {
    const mock = jest.spyOn(usersService, 'updateUser_UserName');
    mock.mockImplementation((id: string, userName:string) => { 
      return new Promise((resolve, reject) => { 
        resolve();
      }); 
    });
    it("Call with a correct values should return a 200", async () => {
      await supertest(app.getHttpServer()).put('/users/updateUserName/moniddeuser?userName=toto').expect(204)
    });
    it("Call without id should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/updateUserName/?userName=toto').expect(400);
    });
    it("Call without username should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/updateUserName/moniddeuser').expect(400);
    });
    mock.mockClear();
  })

  describe('updateUser_Password test cases', () => {
    const mock = jest.spyOn(usersService, 'updateUser_Password');
    mock.mockImplementation((id: string, password:string) => { 
      return new Promise((resolve, reject) => { 
        resolve();
      }); 
    });
    it("Call with a correct values should return a 200", async () => {
      await supertest(app.getHttpServer()).put('/users/updatePassword/moniddeuser?password=toto').expect(204)
    });
    it("Call without id should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/updatePassword/?password=toto').expect(400);
    });
    it("Call without username should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/updatePassword/moniddeuser').expect(400);
    });
    mock.mockClear();
  })

  describe('updateUser_Status test cases', () => {
    const mock = jest.spyOn(usersService, 'updateUser_Status');
    mock.mockImplementation((id: string, password:string) => { 
      return new Promise((resolve, reject) => { 
        resolve();
      }); 
    });
    it("Call with a correct values should return a 200", async () => {
      await supertest(app.getHttpServer()).put('/users/updateStatus/moniddeuser?status=Activated').expect(204)
    });
    it("Call without id should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/updateStatus/?status=Activated').expect(400);
    });
    it("Call without username should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/updateStatus/moniddeuser').expect(400);
    });
    mock.mockClear();
  })

  describe('resetPassword test cases', () => {
    const mock = jest.spyOn(usersService, 'resetPassword');
    mock.mockImplementation((id: string) => { 
      return new Promise((resolve, reject) => { 
        resolve();
      }); 
    });
    it("Call with a correct values should return a 200", async () => {
      await supertest(app.getHttpServer()).put('/users/resetPassword/moniddeuser').expect(204)
    });
    it("Call without id should return a 400", async () => {
      await supertest(app.getHttpServer()).put('/users/resetPassword').expect(400);
    });
  })

  describe('deleteUser test cases', () => {
    const mock = jest.spyOn(usersService, 'deleteUser');
    mock.mockImplementation((id: string) => { 
      return new Promise((resolve, reject) => { 
        resolve();
      }); 
    });
    it("Call with a correct values should return a 200", async () => {
      await supertest(app.getHttpServer()).delete('/users/moniddeuser').expect(204)
    });
    it("Call without id should return a 404", async () => {
      await supertest(app.getHttpServer()).delete('/users').expect(404);
    });
    mock.mockClear();
  })

  describe('MongoDb is off', () => {
    it("Call should return a 500", async () => {
      const mock500 = jest.spyOn(usersService, 'getUser');
      mock500.mockImplementation((id:string) => { 
        throw new InternalServerErrorException('pas content');
      });
      await supertest(app.getHttpServer()).get(`/users/nomongo`)
        .expect(500).then((res) => {
          expect(res.body.error).toBe('Internal Server Error');
          expect(res.body.message).toBe('pas content')
        });
      mock500.mockClear();
    });
  });
});
