import { CarsRepository } from './cars.repository';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';
export declare class CarsService {
    private readonly carsRepo;
    constructor(carsRepo: CarsRepository);
    create(dto: CreateCarDto): Promise<CarSerializer>;
    findAll(query: QueryCarDto): Promise<PageDto<CarSerializer>>;
    findOne(id: number): Promise<CarSerializer>;
    update(id: number, dto: UpdateCarDto): Promise<CarSerializer>;
    remove(id: number): Promise<void>;
}
