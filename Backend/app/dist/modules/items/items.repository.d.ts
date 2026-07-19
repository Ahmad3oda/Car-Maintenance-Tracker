import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
export declare class ItemsRepository {
    private readonly repo;
    constructor(repo: Repository<Item>);
    create(item: Partial<Item>): Promise<Item>;
    findAll(page?: number, limit?: number, search?: string, sortBy?: string, order?: 'ASC' | 'DESC', carId?: number): Promise<[Item[], number]>;
    findOne(id: number): Promise<Item | null>;
    update(id: number, item: Partial<Item>): Promise<Item | null>;
    remove(id: number): Promise<void>;
    save(item: Item): Promise<Item>;
}
