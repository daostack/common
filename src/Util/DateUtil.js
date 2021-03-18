import moment from 'moment';

export const monthShortNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const formatNotificationDate = (date) => {
  let dateFormatted;
  if (moment(date).isAfter(moment().subtract(1, 'd'))) {
    dateFormatted = moment(date).fromNow();
  } else if (moment(date).isAfter(moment().subtract(2, 'd'))) {
    dateFormatted = `Yesterday, ${moment(date).format('HH:MM')}`;
  } else if (moment(date).isAfter(moment().subtract(7, 'd'))) {
    dateFormatted = moment(date).format('dddd, HH:MM');
  } else {
    dateFormatted = moment(date).format('MMM DD, YYYY, HH:MM');
  }

  return dateFormatted;
};
