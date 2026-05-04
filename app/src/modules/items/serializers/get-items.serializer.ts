import { ItemSerializer } from './item.serializer';

export class GetItemsSerializer {
  data: ItemSerializer[];
  total: number;
  page: number;
  limit: number;
}
