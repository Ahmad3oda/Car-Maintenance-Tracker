import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    // Mock Car data
    const car = {
        id: params.id,
        plateNumber: 'ABC-123',
        brand: 'Toyota',
        model: 'Camry',
        year: 2018,
        currentKm: 54000,
        photoPath: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=200&auto=format&fit=crop'
    };

    // Mock Items data
    const items = [
        { id: 1, name: 'Engine Oil', manufacturer: 'Castrol', installedDate: '2023-05-10', installedKm: 48000, nextMaintenanceKm: 58000, nextMaintenanceDate: '2023-11-10', photoPath: null },
        { id: 2, name: 'Brake Pads', manufacturer: 'Brembo', installedDate: '2022-10-15', installedKm: 35000, nextMaintenanceKm: 75000, nextMaintenanceDate: '2024-10-15', photoPath: null },
        { id: 3, name: 'Air Filter', manufacturer: 'K&N', installedDate: '2023-01-20', installedKm: 40000, nextMaintenanceKm: 60000, nextMaintenanceDate: '2024-01-20', photoPath: null },
    ];

    return {
        car,
        items
    };
};
