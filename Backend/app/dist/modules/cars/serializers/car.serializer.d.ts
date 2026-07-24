export declare class CarSerializer {
    id: number;
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    photoPath: string | null;
    currentKm: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CarSerializer>);
}
