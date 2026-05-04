import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
export declare class RecordsController {
    private readonly recordsService;
    constructor(recordsService: RecordsService);
    create(createRecordDto: CreateRecordDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRecordDto: UpdateRecordDto): string;
    remove(id: string): string;
}
