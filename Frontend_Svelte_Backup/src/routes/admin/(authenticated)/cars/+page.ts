import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    // Mock cars data
    const cars = [
        { id: 1, plateNumber: 'ABC-123', brand: 'Toyota', model: 'Camry', year: 2018, currentKm: 54000, photoPath: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=200&auto=format&fit=crop' },
        { id: 2, plateNumber: 'XYZ-987', brand: 'Honda', model: 'Civic', year: 2020, currentKm: 32000, photoPath: 'https://images.unsplash.com/photo-1590362891991-f702315fa418?q=80&w=200&auto=format&fit=crop' },
        { id: 3, plateNumber: 'DEF-456', brand: 'Ford', model: 'Focus', year: 2015, currentKm: 85000, photoPath: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=200&auto=format&fit=crop' },
    ];

    return {
        cars
    };
};
