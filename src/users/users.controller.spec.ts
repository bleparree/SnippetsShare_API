import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { GetUser } from './dto/getUser.dto';
import supertest from 'supertest';

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;
  let usersService = new UsersService(null);
  const mockUserList: GetUser[] = [
    { id: 'erjhn5zr4th2rt1', userName: 'User1', eMail: 'User1SnippetShare@yopmail.com', role: 'SuperAdmin', status: 'Activated', initWithMongoObject: GetUser.prototype.initWithMongoObject},
    { id: 'erjhn5zr4th2rt2', userName: 'User2', eMail: 'User2SnippetShare@yopmail.com', role: 'User', status: 'ToActivate', initWithMongoObject: GetUser.prototype.initWithMongoObject}, 
    { id: 'erjhn5zr4th2rt3', userName: 'User3', eMail: 'User3SnippetShare@yopmail.com', role: 'User', status: 'ReInitPassword', initWithMongoObject: GetUser.prototype.initWithMongoObject}, 
    { id: 'erjhn5zr4th2rt4', userName: 'User4', eMail: 'User4SnippetShare@yopmail.com', role: 'User', status: 'Suspended', initWithMongoObject: GetUser.prototype.initWithMongoObject}, 
    { id: 'erjhn5zr4th2rt5', userName: 'User5', eMail: 'User5SnippetShare@yopmail.com', role: 'User', status: 'Activated', initWithMongoObject: GetUser.prototype.initWithMongoObject}
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
    // const mock = jest.spyOn(usersService, 'getRestrictedLabels');
    // mock.mockImplementation((name?:string, type?:string) => { 
    //   return new Promise((resolve, reject) => { 
    //     resolve(userList)
    //   }); 
    // });
    it("Call should return 200", async () => {
      // await getrestrictedLabelSuperTest(`/restricted-labels`, usedRestrictedLabelList);
    });
  })

  describe('getUsers test cases', () => {
    it("Call without param should return 200", async () => {});
    it("Call with query search return 200", async () => {});
    it("Call with query role return 200", async () => {});
    it("Call with query status return 200", async () => {});
    it("Call with all param return 200", async () => {});
  })

  describe('addUser test cases', () => {
    it("", async () => {});
  })

  describe('updateUser test cases', () => {
    it("", async () => {});
  })

  describe('updateUser_UserName test cases', () => {
    it("", async () => {});
  })

  describe('updateUser_Password test cases', () => {
    it("", async () => {});
  })

  describe('updateUser_Status test cases', () => {
    it("", async () => {});
  })

  describe('resetPassword test cases', () => {
    it("", async () => {});
  })

  describe('deleteUser test cases', () => {
    it("", async () => {});
  })

  describe('getUserRoles test cases', () => {
    it("", async () => {});
  })

  describe('getUserStatus test cases', () => {
    it("", async () => {});
  })

  // async function getrestrictedLabelSuperTest(apiCall:string, checkRes:GetUser[]) {
  //   await supertest(app.getHttpServer()).get(apiCall).expect(200)
  //     .then((res) => {
  //         expect(res.body[0].id).toBe(checkRes[0].id);
  //         expect(res.body[0].name).toBe(checkRes[0].name);
  //         expect(res.body[0].type).toBe(checkRes[0].type);
  //     });
  // }
});
