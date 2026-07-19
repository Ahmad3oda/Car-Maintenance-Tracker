import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    // Mock Dashboard Data
    const stats = {
        totalCars: 5,
        totalItems: 32,
        maintenanceThisMonth: 1250.00,
        upcomingMaintenance: 3
    };

    const recentEvents = [
        { id: 1, car: 'Toyota Camry (ABC-123)', item: 'Engine Oil', cost: 150.00, status: 'Completed', date: '2023-10-15' },
        { id: 2, car: 'Honda Civic (XYZ-987)', item: 'Brake Pads', cost: 200.00, status: 'Completed', date: '2023-10-12' },
        { id: 3, car: 'Ford Focus (DEF-456)', item: 'Battery', cost: 120.00, status: 'Pending', date: '2023-10-18' },
        { id: 4, car: 'Toyota Camry (ABC-123)', item: 'Air Filter', cost: 45.00, status: 'Completed', date: '2023-10-10' },
    ];

    return {
        stats,
        recentEvents
    };
};
