export const getExpirationDate = (expiration: string | undefined) => {
  if (expiration) {
    const [month, year] = [
      expiration?.substring(0, 2),
      expiration?.substring(2),
    ];
    return `${month}/20${year}`;
  }
  return '00/00';
};

export const getCardNetwork = (network: string | undefined) => {
  switch (network) {
    case 'VISA':
      return require('~/Assets/visa.png');
    case 'MASTERCARD':
      return require('~/Assets/mastercard.png');
    default:
      return require('~/Assets/mastercard.png');
  }
};
