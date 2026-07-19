export declare class CarSerializer {
    id: number;
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    currentKm: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CarSerializer>);
}
