import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import { ExportCarDataDto, ImportCarDataDto, ImportResultDto } from './dtos/import-export.dto';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';
export declare class CarsController {
    private readonly carsService;
    constructor(carsService: CarsService);
    create(createCarDto: CreateCarDto, photo?: Express.Multer.File): Promise<CarSerializer>;
    findAll(query: QueryCarDto): Promise<PageDto<CarSerializer>>;
    findOne(id: number): Promise<CarSerializer>;
    update(id: number, updateCarDto: UpdateCarDto, photo?: Express.Multer.File): Promise<CarSerializer>;
    exportData(id: number): Promise<ExportCarDataDto>;
    importData(id: number, dto: ImportCarDataDto): Promise<ImportResultDto>;
    remove(id: number): Promise<void>;
}
