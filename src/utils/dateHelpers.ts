export const sortByDate =
  <T extends Record<string, unknown>>(attribute: keyof T) =>
  (a: T, b: T) => {
    const timeA = new Date(a[attribute] as string).getTime();
    const timeB = new Date(b[attribute] as string).getTime();
    return timeB - timeA;
  };
