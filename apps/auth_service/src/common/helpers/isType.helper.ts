import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  isString,
  isInt,
  isDate,
} from 'class-validator';
import { Gte, Lt, Lte, Gt, Ne, Il, Like } from '../types';
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
  neDate: function (value: any, args: ValidationArguments): value is Ne<Date> {
    return 'ne' in value && isDate(value.ne);
  },
  ilDate: function (value: any, args: ValidationArguments): value is Il<Date> {
    return 'il' in value && isDate(value.il);
  },
  likeDate: function (
    value: any,
    args: ValidationArguments,
  ): value is Like<Date> {
    return 'like' in value && isDate(value.like);
  },
  date: function (value: any, args: ValidationArguments) {
    return isDate(value);
  },
  dateArray: function (value: any, args: ValidationArguments) {
    return Array.isArray(value) && value.every(isDate);
  },
  inDate: function (value: any, args: ValidationArguments) {
    return 'in' in value && Array.isArray(value.in) && value.in.every(isDate);
  },
  ninDate: function (value: any, args: ValidationArguments) {
    return (
      'nin' in value && Array.isArray(value.nin) && value.nin.every(isDate)
    );
  },
  neString: function (value: any, args: ValidationArguments) {
    return 'ne' in value && isString(value.ne);
  },
  ilString: function (value: any, args: ValidationArguments) {
    return 'il' in value && isString(value.il);
  },
  likeString: function (value: any, args: ValidationArguments) {
    return 'like' in value && isString(value.like);
  },
  inString: function (value: any, args: ValidationArguments) {
    return 'in' in value && Array.isArray(value.in) && value.in.every(isString);
  },
  ninString: function (value: any, args: ValidationArguments) {
    return (
      'nin' in value && Array.isArray(value.nin) && value.nin.every(isString)
    );
  },
  neInt: function (value: any, args: ValidationArguments) {
    return 'ne' in value && isInt(value.ne);
  },
  ilInt: function (value: any, args: ValidationArguments) {
    return 'il' in value && isInt(value.il);
  },
  likeInt: function (value: any, args: ValidationArguments) {
    return 'like' in value && isInt(value.like);
  },
  inInt: function (value: any, args: ValidationArguments) {
    return 'in' in value && Array.isArray(value.in) && value.in.every(isInt);
  },
  ninInt: function (value: any, args: ValidationArguments) {
    return 'nin' in value && Array.isArray(value.nin) && value.nin.every(isInt);
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
