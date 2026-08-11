import { Order, PageOptionsDto } from '../../../common/dtos/page-options.dto';
export declare class QueryMaintenanceRecordDto extends PageOptionsDto {
    readonly order?: Order;
    readonly sortBy?: string;
    carId?: number;
    itemId?: number;
}
