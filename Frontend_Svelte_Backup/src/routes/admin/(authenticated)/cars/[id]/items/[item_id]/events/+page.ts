import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    // Mock Item
    const item = {
        id: params.item_id,
        carId: params.id,
        name: 'Engine Oil',
        manufacturer: 'Castrol',
    };

    // Mock Events
    const events = [
        { id: 1, maintenanceDate: '2023-10-15', kmCounter: 54000, itemCost: 150.00, extraCosts: [{ name: 'Labor', cost: 50.00 }], notes: 'Regular oil change' },
        { id: 2, maintenanceDate: '2023-05-10', kmCounter: 48000, itemCost: 140.00, extraCosts: [{ name: 'Labor', cost: 50.00 }], notes: 'Previous oil change' },
    ];

    return {
        item,
        events
    };
};
