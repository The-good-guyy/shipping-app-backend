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
  gteDate: function (
    value: any,
    args: ValidationArguments,
  ): value is Gte<Date> {
    return 'gte' in value && isDate(value.gte);
  },
  lteDate: function (
    value: any,
    args: ValidationArguments,
  ): value is Lte<Date> {
    return 'lte' in value && isDate(value.lte);
  },
  ltDate: function (value: any, args: ValidationArguments): value is Lt<Date> {
    return 'lt' in value && isDate(value.lt);
  },
  gtDate: function (value: any, args: ValidationArguments): value is Gt<Date> {
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
