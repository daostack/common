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


export const takeRightFromString = ({str, separator = '/', numberOfElements = 0}: {str: string, separator: string, numberOfElements: number}): string[] => {

  if (!str) {
    return [];
  }

  const elements = str.split(separator);
  return elements.slice(-numberOfElements);
};
