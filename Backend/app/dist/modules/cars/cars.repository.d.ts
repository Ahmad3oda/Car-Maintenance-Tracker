import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
export declare class CarsRepository {
    private readonly repo;
    constructor(repo: Repository<Car>);
    create(car: Partial<Car>): Promise<Car>;
    findAll(page?: number, limit?: number, search?: string, sortBy?: string, order?: 'ASC' | 'DESC'): Promise<[Car[], number]>;
    findOne(id: number): Promise<Car | null>;
    update(id: number, car: Partial<Car>): Promise<Car | null>;
    remove(id: number): Promise<void>;
}
