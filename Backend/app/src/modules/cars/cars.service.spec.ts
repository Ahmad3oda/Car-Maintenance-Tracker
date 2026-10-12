import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { DataSource } from 'typeorm';
import { CarsRepository } from './cars.repository';
import { OdometerService } from './odometer.service';

describe('CarsService', () => {
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: CarsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findOneByPlate: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn(),
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

    service = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
