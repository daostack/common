export const GOOGLE_SIGNIN_PERMISSIONS = {
  APP_DATA_RW: 'https://www.googleapis.com/auth/drive.appdata',
};
export const kFormatter = num => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
};
