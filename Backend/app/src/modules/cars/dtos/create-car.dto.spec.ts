import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCarDto } from './create-car.dto';
import { UpdateCarDto } from './update-car.dto';

const base = {
  plateNumber: 'ABC123',
  brand: 'Kia',
  model: 'Rio',
  currentKm: 0,
};

async function yearErrors(
  cls: typeof CreateCarDto | typeof UpdateCarDto,
  year: unknown,
) {
  const errors = await validate(plainToInstance(cls, { ...base, year }));
  return errors.filter((e) => e.property === 'year');
}

describe('CreateCarDto year', () => {
  const nextYear = new Date().getFullYear() + 1;

  it('accepts next year (early model releases)', async () => {
    expect(await yearErrors(CreateCarDto, nextYear)).toHaveLength(0);
  });

  it('rejects years after next year', async () => {
    const errors = await yearErrors(CreateCarDto, 3000);
    expect(errors).toHaveLength(1);
    expect(Object.values(errors[0].constraints!)).toContain(
      `year must not be later than ${nextYear}`,
    );
  });

  it('rejects years after next year on update', async () => {
    expect(await yearErrors(UpdateCarDto, nextYear + 1)).toHaveLength(1);
  });

  it('still rejects years before 1900', async () => {
    expect(await yearErrors(CreateCarDto, 1899)).toHaveLength(1);
  });
});
