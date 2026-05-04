import { Record } from '../../records/entities/record.entity';

export class ItemSerializer {
  id: number;
  name: string;
  description: string;
  photoPath: string;
  lastRecord: Record | null;
}
