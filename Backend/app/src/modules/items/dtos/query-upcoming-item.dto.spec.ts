import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  QueryUpcomingItemDto,
  UPCOMING_SORT_FIELDS,
} from './query-upcoming-item.dto';

const sortByErrors = async (sortBy: string) =>
  (await validate(plainToInstance(QueryUpcomingItemDto, { sortBy }))).filter(
    (e) => e.property === 'sortBy',
  );

describe('QueryUpcomingItemDto sortBy', () => {
  it.each(UPCOMING_SORT_FIELDS)('accepts %s', async (field) => {
    expect(await sortByErrors(field)).toHaveLength(0);
  });

  it.each(['__proto__', 'constructor', 'car.brand', 'photoPath'])(
    'rejects %s',
    async (field) => {
      expect(await sortByErrors(field)).toHaveLength(1);
    },
  );
});
