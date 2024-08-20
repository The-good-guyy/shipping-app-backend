import { isEqual } from 'lodash';

type PartialRecord<T> = Partial<Record<keyof T, T[keyof T]>>;

export const getChangedFields = <T>(
  oldRecord: PartialRecord<T>,
  newRecord: PartialRecord<T>,
): Partial<T> => {
  const changedFields: PartialRecord<T> = {};

  for (const key in newRecord) {
    if (!(key in oldRecord)) {
      changedFields[key] = newRecord[key];
    }

    const oldValue = oldRecord[key];
    const newValue = newRecord[key];

    if (!isEqual(oldValue, newValue)) {
      changedFields[key] = newValue;
    }
  }

  return changedFields as Partial<T>;
};
