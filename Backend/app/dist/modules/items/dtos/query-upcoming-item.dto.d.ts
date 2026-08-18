import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
export declare enum UpcomingScope {
    DUE_SOON_OR_OVERDUE = "due_soon_or_overdue",
    OVERDUE_ONLY = "overdue_only",
    WITHIN_1K_KM = "within_1k_km",
    WITHIN_30_DAYS = "within_30_days",
    ALL = "all"
}
export declare class QueryUpcomingItemDto extends PageOptionsDto {
    carId?: number;
    scope?: UpcomingScope;
}
