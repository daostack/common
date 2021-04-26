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
  console.log(date);

  if (date) {
    if (moment(date).isAfter(moment().subtract(1, 'd'))) {
      console.log('1');

      dateFormatted = moment(date).fromNow();
    } else if (moment(date).isAfter(moment().subtract(2, 'd'))) {
      console.log('2');

      dateFormatted = `Yesterday, ${moment(date).format('HH:MM')}`;
    } else if (moment(date).isAfter(moment().subtract(7, 'd'))) {
      console.log('3');

      dateFormatted = moment(date).format('dddd, HH:MM');
    } else {
      console.log('4');

      dateFormatted = moment(date).format('MMM DD, YYYY, HH:MM');
    }
  }

  return dateFormatted;
};
