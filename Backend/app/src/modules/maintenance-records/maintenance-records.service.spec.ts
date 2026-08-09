import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceRecordsService } from './maintenance-records.service';
import { MaintenanceRecordsRepository } from './maintenance-records.repository';
import { ItemsRepository } from '../items/items.repository';
import { CarsRepository } from '../cars/cars.repository';

describe('MaintenanceRecordsService', () => {
  let service: MaintenanceRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceRecordsService,
        {
          provide: MaintenanceRecordsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ItemsRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CarsRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MaintenanceRecordsService>(MaintenanceRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
