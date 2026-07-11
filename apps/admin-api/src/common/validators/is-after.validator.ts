import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfter', async: false })
class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedProperty] = args.constraints as [string];
    const object = args.object as Record<string, unknown>;
    const relatedValue = object[relatedProperty];

    if (typeof value !== 'string' || typeof relatedValue !== 'string') {
      return true;
    }

    const date = new Date(value);
    const relatedDate = new Date(relatedValue);

    if (Number.isNaN(date.getTime()) || Number.isNaN(relatedDate.getTime())) {
      return true;
    }

    return date.getTime() > relatedDate.getTime();
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedProperty] = args.constraints as [string];
    return `${args.property} must be after ${relatedProperty}`;
  }
}

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyName),
      options: validationOptions,
      constraints: [property],
      validator: IsAfterConstraint,
    });
  };
}
