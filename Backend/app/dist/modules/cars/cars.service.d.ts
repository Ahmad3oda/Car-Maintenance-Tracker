import { DataSource } from 'typeorm';
import { CarsRepository } from './cars.repository';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import { ExportCarDataDto, ImportCarDataDto, ImportResultDto } from './dtos/import-export.dto';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';
export declare class CarsService {
    private readonly carsRepo;
    private readonly dataSource;
    constructor(carsRepo: CarsRepository, dataSource: DataSource);
    create(dto: CreateCarDto, photo?: Express.Multer.File): Promise<CarSerializer>;
    findAll(query: QueryCarDto): Promise<PageDto<CarSerializer>>;
    findOne(id: number): Promise<CarSerializer>;
    update(id: number, dto: UpdateCarDto, photo?: Express.Multer.File): Promise<CarSerializer>;
    remove(id: number): Promise<void>;
    exportCarData(id: number): Promise<ExportCarDataDto>;
    importCarData(carId: number, dto: ImportCarDataDto): Promise<ImportResultDto>;
}
