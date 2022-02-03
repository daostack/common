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

export const getUrlPathWithEntityId = ({
  str,
  separator = '/',
}: {
  str: string;
  separator: string;
}): string[] => {
  if (!str) {
    return [];
  }

  const elements = str.split(separator);
  const entityId = elements.pop() as string;
  const screenName = elements.join(separator);
  return [screenName, entityId];
};
