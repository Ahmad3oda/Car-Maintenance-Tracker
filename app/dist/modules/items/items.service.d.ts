import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class ItemsService {
    create(createItemDto: CreateItemDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateItemDto: UpdateItemDto): string;
    remove(id: number): string;
}
