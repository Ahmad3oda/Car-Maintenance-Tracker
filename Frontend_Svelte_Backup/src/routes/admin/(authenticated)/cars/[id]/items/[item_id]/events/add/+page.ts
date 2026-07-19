import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    return {
        carId: params.id,
        itemId: params.item_id
    };
};
