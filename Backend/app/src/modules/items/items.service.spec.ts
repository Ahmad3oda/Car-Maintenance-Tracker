import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemsRepository } from './items.repository';
import { CarsRepository } from '../cars/cars.repository';
import { OdometerService } from '../cars/odometer.service';
import { DataSource } from 'typeorm';

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ItemsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CarsRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
        {
          provide: OdometerService,
          useValue: {
            sync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
