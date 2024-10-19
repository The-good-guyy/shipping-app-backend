interface sortObject {
  order: string;
  orderBy: string;
}
export function sortHandle(sort: sortObject[]) {
  const sortOrder = {};
  sort.forEach((obj) => {
    const sortOrderBy = obj.orderBy.split('.');
    let object = sortOrder;
    for (let i = 0; i < sortOrderBy.length - 1; i++) {
      const prop = sortOrderBy[i];
      object[prop] = {};
      object = object[prop];
    }
    object[sortOrderBy[sortOrderBy.length - 1]] = obj.order;
  });
  return sortOrder;
}
