import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEqualTo', async: false })
class IsEqualToConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedProperty] = args.constraints as [string];
    const object = args.object as Record<string, unknown>;
    return value === object[relatedProperty];
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedProperty] = args.constraints as [string];
    return `${args.property} must match ${relatedProperty}`;
  }
}

export function IsEqualTo(property: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyName),
      options: validationOptions,
      constraints: [property],
      validator: IsEqualToConstraint,
    });
  };
}
