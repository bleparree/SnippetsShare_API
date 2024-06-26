import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { GetUser } from './dto/getUser.dto';
import { UserRoleList } from 'src/resources/entities/userRoleList.entity';
import { UserStatusList } from 'src/resources/entities/userStatusList.entity';
import { AddUser } from './dto/addUser.dto';
import { UpdateFullUser } from './dto/updateFullUser.dto';
import { MongodbModule } from 'src/mongodb.module';
import { UserMock } from 'src/resources/mock/user-mock';

describe('UsersService', () => {
  let service: UsersService;
  const userFullList = (new UserMock()).fullList;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongodbModule],
      providers: [
        UsersService
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('Test to get an existing user', async () => {
      await service.getUser(userFullList[0]._id.toString()).then((res:User) => {
        expect(res).toStrictEqual(new GetUser(userFullList[0]));
      });
    });
    it('Test to get an non existent user', async () => {
      try {
        let res = await service.getUser(new ObjectId().toString());
        expect(res).toBeNull()
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('Test to get with a wrongly composed id', async () => {
      try {
        let res = await service.getUser('badid');
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
      }
    });
  });
  
  describe('getUsers', () => {
    it('Test to get the entire list without filter', async () => {
      let res = await service.getUsers();
      expect(res).toStrictEqual(userFullList.map(val => new GetUser(val)));
    });
    it('Test to get the list filtered by a username', async () => {
      let searchText = 'wiDad';
      let res = await service.getUsers(searchText);
      expect(res).toStrictEqual(
        userFullList.filter(val => val.userName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.eMail.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 ).map(val => new GetUser(val)));
    });
    it('Test to get the list filtered by an email', async () => {
      let searchText = 'wiwi';
      let res = await service.getUsers(searchText);
      expect(res).toStrictEqual(
        userFullList.filter(val => val.userName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.eMail.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 ).map(val => new GetUser(val)));
    });
    it('Test to get the list filtered by a part of mail + username', async () => {
      let searchText = 'ben';
      let res = await service.getUsers(searchText);
      expect(res).toStrictEqual(
        userFullList.filter(val => val.userName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.eMail.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 ).map(val => new GetUser(val)));
    });
    it('Test to get the list filtered by superadmin role', async () => {
      let searchRole = UserRoleList.SuperAdmin;
      let res = await service.getUsers(null, [searchRole]);
      expect(res).toStrictEqual(userFullList.filter(val => val.role == searchRole).map(val => new GetUser(val)));
    });
    it('Test to get the list filtered by ToActivate status', async () => {
      let searchStatus = UserStatusList.ToActivate;
      let res = await service.getUsers(null, null, [searchStatus]);
      expect(res).toStrictEqual(userFullList.filter(val => val.status == searchStatus).map(val => new GetUser(val)));
    });
    it('Test to get the list with searchname test.fr and role user and status Activated', async () => {
      let searchText = 'test.fr';
      let searchStatus = UserStatusList.ToActivate;
      let res = await service.getUsers(searchText, null, [searchStatus]);
      expect(res).toStrictEqual(
        userFullList.filter(val => val.status == searchStatus &&
                                  (val.userName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.eMail.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0)).map(val => new GetUser(val)));
    });
    it('Test to get the list with searchname widad (different case) and status ReInitPassword', async () => {
      let searchText = 'widad';
      let res = await service.getUsers(searchText);
      expect(res).toStrictEqual(
        userFullList.filter(val => val.userName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 || 
                                    val.eMail.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0 ).map(val => new GetUser(val)));
    });
    it('Test to get something who don\'t exist', async () => {
      let searchText = 'something who dont exist';
      let res = await service.getUsers(searchText);
      expect(res).toStrictEqual([]);
    });
  });

  describe('addUser', () => {
    it('Test to add a user', async () => {
      let add:AddUser = { userName: 'newUser1', password: 'qs5f41fqs0', eMail: 'newUser1@test.fr'};
      let res = await service.addUser(add);
      expect(res).toBeDefined();
      expect(res.length).toBeGreaterThan(10);
    });
  });

  describe('updateUser', () => {
    it('Test to update a user', async () => {
      let toUpdate = userFullList.find(res => res.userName == 'Caroline');
      let newMail = 'newUser1@test.fr';
      let up:UpdateFullUser = { userName: toUpdate.userName, eMail: newMail, role: toUpdate.role, status: toUpdate.status};
      let res:UpdateFullUser = await service.updateUser(toUpdate._id.toString(), up);
      expect(res).toBeDefined();
      expect(res.eMail).toBe(newMail);
      expect(res.userName).toBe(toUpdate.userName);
    });
    it('Test to update an unknow id', async () => {
      let toUpdate = userFullList.find(res => res.userName == 'Caroline');
      let newMail = 'newUser2@test.fr';
      let up:UpdateFullUser = { userName: toUpdate.userName, eMail: newMail, role: toUpdate.role, status: toUpdate.status};
      try {
        await service.updateUser((new ObjectId()).toString(), up);
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateUser_UserName', () => {
    it('Test to update the user uersname', async () => {
      let toUpdate = userFullList.find(res => res.userName == 'Caroline');
      await service.updateUser_UserName(toUpdate._id.toString(), 'Caroline1');
      
      let user:GetUser = await service.getUser(toUpdate._id.toString());
      expect(user).toBeDefined();
      expect(user.userName).toBe('Caroline1');
    });
    it('Test to update an unknow id', async () => {
      try {
        await service.updateUser_UserName((new ObjectId()).toString(), 'titi');
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateUser_Password', () => {
    it('Test to update the user password', async () => {
      let toUpdate = userFullList.find(res => res.userName == 'Caroline');
      await service.updateUser_Password(toUpdate._id.toString(), 'rereg651e,rher51h');
    });
    it('Test to update an unknow id', async () => {
      try {
        await service.updateUser_Password((new ObjectId()).toString(), 'rereg651e,rher51h');
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateUser_Status', () => {
    it('Test to update the user status', async () => {
      let toUpdate = userFullList.find(res => res.userName == 'Caroline');
      await service.updateUser_Status(toUpdate._id.toString(), UserStatusList.Activated);
      
      let user:GetUser = await service.getUser(toUpdate._id.toString());
      expect(user).toBeDefined();
      expect(user.status).toBe(UserStatusList.Activated);
    });
    it('Test to update an unknow id', async () => {
      try {
        await service.updateUser_Status((new ObjectId()).toString(), UserStatusList.Activated);
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  // describe('resetPassword', () => {});

  describe('deleteUser', () => {
    it('Test to delete a user', async () => {
      let toUpdate = userFullList.find(res => res.userName == 'Caroline');
      await service.deleteUser(toUpdate._id.toString());
      
      try {
        let res = await service.getUser(toUpdate._id.toString());
        expect(res).toBeNull()
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('Test to delete an unknow id', async () => {
      try {
        await service.deleteUser((new ObjectId()).toString());
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
