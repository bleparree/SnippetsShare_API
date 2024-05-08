import { Test, TestingModule } from '@nestjs/testing';
import { RestrictedLabelsService } from './restricted-labels.service';
import { RestrictedLabel } from './entities/restrictedLabel.entity';
import { ObjectId } from 'mongodb';
import { addRestrictedLabel } from './dto/addRestrictedLabel.dto';
import { updateRestrictedLabel } from './dto/updateRestrictedLabel.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MongodbModule } from 'src/mongodb.module';
import { RestrictedLabelMock } from 'src/resources/mock/restricted-labels-mock';

describe('RestrictedLabelsService', () => {
  let service: RestrictedLabelsService;
  const restrictedLabelFullList = (new RestrictedLabelMock()).fullList;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongodbModule],
      providers: [
        RestrictedLabelsService,
      ],
    }).compile();

    service = module.get<RestrictedLabelsService>(RestrictedLabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRestrictedLabels', () => {
    it('Test to get the full list', async () => {
      await service.getRestrictedLabels().then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(restrictedLabelFullList.map(val => new RestrictedLabel(val)));
      })
    });
    it('Test to filter by name', async () => {
      const filterName = 'MyT';
      await service.getRestrictedLabels(filterName).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val)).filter((lb) => lb.name.toLowerCase().indexOf(filterName.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter by name with upper case', async () => {
      const filterName = 'myt';
      await service.getRestrictedLabels(filterName).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val)).filter((lb) => lb.name.toLowerCase().indexOf(filterName.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter by type', async () => {
      const filterType = 'Code';
      await service.getRestrictedLabels(null, filterType).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val)).filter((lb) => lb.type.toLowerCase().indexOf(filterType.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter name and type', async () => {
      const filterName = 'myt';
      const filterType = 'Code';
      await service.getRestrictedLabels(filterName, filterType).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual(
          restrictedLabelFullList.map(val => new RestrictedLabel(val))
            .filter((lb) => lb.type.toLowerCase().indexOf(filterType.toLowerCase()) != -1)
            .filter((lb) => lb.name.toLowerCase().indexOf(filterName.toLowerCase()) != -1)
        );
      })
    });
    it('Test to filter by something which does not exist', async () => {
      const filterName = 'Do not exist';
      await service.getRestrictedLabels(filterName).then((res:RestrictedLabel[]) => {
        expect(res).toStrictEqual([]);
      })
    });
  });

  describe('addRestrictedLabel', () => {
    it('Test to add a new label',async () => {
      let add:addRestrictedLabel = { name: 'AddLabel', type: 'Code'};
      await service.addRestrictedLabel(add).then((res:string) => {
        expect(res).toBeDefined();
        expect(res.length).toBeGreaterThan(10);
      })
    });
  });

  describe('updateRestrictedLabel', () => {
    it('Test to update an existing label',async () => {
      await service.updateRestrictedLabel(restrictedLabelFullList[0]._id.toString(), 'UpdatedName').then((res:updateRestrictedLabel) => {
        expect(res).toBeDefined();
        expect(res.name).toBe('UpdatedName');
        expect(res.id).toBe(restrictedLabelFullList[0]._id.toString());
      })
    });
    it('Test to update with an unknown id',async () => {
      try {
        let res = await service.updateRestrictedLabel(new ObjectId().toString(), 'NotFound');
        expect(res).toBeNull();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
    it('Test to update with an invalid id',async () => {
      try {
        let res = await service.updateRestrictedLabel('kihg654zef4561zef', 'NotFound');
        expect(res).toBeNull();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('deleteRestrictedLabel', () => {
    it('Test to delete an existing label',async () => {
      try {
        await service.deleteRestrictedLabel(restrictedLabelFullList[0]._id.toString());
        expect(1).toBe(1);
      }
      catch(error) {
        expect(error).toBeNull();
      }
    });
    it('Test to delete with an unknown id',async () => {
      try {
        await service.deleteRestrictedLabel((new ObjectId()).toString());
        expect(1).toBe(2);
      }
      catch(error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
