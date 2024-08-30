import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  isString,
  isInt,
  isDate,
} from 'class-validator';
import { Gte, Lt, Lte, Gt } from '../types';
const typeValidator = {
  string: function (value: any, args: ValidationArguments) {
    return isString(value); // Use the imported isString function
  },
  int: function (value: any, args: ValidationArguments) {
    return isInt(value); // Use the imported isInt function
  },
  gte: function (value: any, args: ValidationArguments): value is Gte {
    return 'gte' in value && isDate(value.gte);
  },
  lte: function (value: any, args: ValidationArguments): value is Lte {
    return 'lte' in value && isDate(value.lte);
  },
  lt: function (value: any, args: ValidationArguments): value is Lt {
    return 'lt' in value && isDate(value.lt);
  },
  gt: function (value: any, args: ValidationArguments): value is Gt {
    return 'gt' in value && isDate(value.gt);
  },
  date: function (value: any, args: ValidationArguments) {
    return isDate(value); // Use the imported isDate function
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
