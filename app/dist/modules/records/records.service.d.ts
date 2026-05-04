import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
export declare class RecordsService {
    create(createRecordDto: CreateRecordDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRecordDto: UpdateRecordDto): string;
    remove(id: number): string;
}
