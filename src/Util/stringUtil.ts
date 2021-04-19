export const truncateString = (
  str: string,
  len: number,
  end: string = '...',
) => {
  if (str.length <= len) {
    return str;
  }

  return str.slice(0, len) + end;
};
