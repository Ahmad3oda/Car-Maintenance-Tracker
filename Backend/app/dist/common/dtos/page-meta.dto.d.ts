export interface PageMetaDtoParameters {
    pageOptionsDto: {
        page?: number;
        limit?: number;
    };
    itemCount: number;
}
export declare class PageMetaDto {
    readonly page: number;
    readonly limit: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasPreviousPage: boolean;
    readonly hasNextPage: boolean;
    constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters);
}
