import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  isString,
  isInt,
} from 'class-validator';
import { Gte, Lt, Lte, Gt } from '../../users/dto';
const typeValidator = {
  string: function (value: any, args: ValidationArguments) {
    return isString(value); // Use the imported isString function
  },
  int: function (value: any, args: ValidationArguments) {
    return isInt(value); // Use the imported isInt function
  },
  gte: function (value: any, args: ValidationArguments): value is Gte {
    return 'gte' in value && isString(value.gte);
  },
  lte: function (value: any, args: ValidationArguments): value is Lte {
    return 'lte' in value && isString(value.lte);
  },
  lt: function (value: any, args: ValidationArguments): value is Lt {
    return 'lt' in value && isString(value.lt);
  },
  gt: function (value: any, args: ValidationArguments): value is Gt {
    return 'gt' in value && isString(value.gt);
  },
};

export function IsType(
  types: (keyof typeof typeValidator)[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'wrongType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return types.some((v) => typeValidator[v](value, args));
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          const lastType = types.pop();
          if (types.length == 0) return `Has to be ${lastType}`;
          return `Can only be ${types.join(', ')} or ${lastType}.`;
        },
      },
    });
  };
}
