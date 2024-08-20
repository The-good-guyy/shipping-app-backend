export function stringToEnum<T>(
  enumType: T,
  value: string,
): T[keyof T] | undefined {
  const values = Object.values(enumType) as string[];
  if (values.includes(value)) {
    return value as T[keyof T];
  }
  return undefined;
}
