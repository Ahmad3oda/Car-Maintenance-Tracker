import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';
export declare class CarsController {
    private readonly carsService;
    constructor(carsService: CarsService);
    create(createCarDto: CreateCarDto): Promise<CarSerializer>;
    findAll(query: QueryCarDto): Promise<PageDto<CarSerializer>>;
    findOne(id: number): Promise<CarSerializer>;
    update(id: number, updateCarDto: UpdateCarDto): Promise<CarSerializer>;
    remove(id: number): Promise<void>;
}
