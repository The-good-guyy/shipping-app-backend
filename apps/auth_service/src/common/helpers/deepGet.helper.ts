export const deepGet = function (
  obj: any,
  path: string,
  defaultValue: any = undefined,
) {
  return (
    path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue
  );
};
