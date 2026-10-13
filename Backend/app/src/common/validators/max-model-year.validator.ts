import { ValidationOptions, ValidateBy, buildMessage } from 'class-validator';

/** Latest accepted model year: next calendar year (new models ship early). */
export function maxModelYear(): number {
  return new Date().getFullYear() + 1;
}

/** Rejects years after next year; evaluated per request, not at startup. */
export function MaxModelYear(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'maxModelYear',
      validator: {
        validate: (value: unknown) =>
          typeof value === 'number' && value <= maxModelYear(),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property must not be later than ${maxModelYear()}`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
