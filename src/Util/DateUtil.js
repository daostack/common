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
  let dateFormatted = '';
  if (date) {
    if (moment(date).isAfter(moment().subtract(1, 'd'))) {
      dateFormatted = moment(date).fromNow();
    } else if (moment(date).isAfter(moment().subtract(2, 'd'))) {
      dateFormatted = `Yesterday, ${moment(date).format('HH:MM')}`;
    } else if (moment(date).isAfter(moment().subtract(7, 'd'))) {
      dateFormatted = moment(date).format('dddd, HH:MM');
    } else {
      dateFormatted = moment(date).format('MMM DD, YYYY, HH:MM');
    }
  }

  return dateFormatted;
};

/**
 * Adds a leading 0 to digits, so the num will be displayed as a double digit
 * 4 -> 04
 * @param num        the number we want to add a leading zero to
 * @return   the number with a leading zero if it's < 10, or without a leading zero when its > 10
 */
const leadingZero = (num) => (num < 10 ? `0${num}` : num);

/**
 * Get a string of the frozen countdown for when a proposal is hidden, and we want to show a stopped countdown
 * @param until the time the countdown froze
 * @return a string that represents the frozen time dd:hh:mm:ss
 */
export const getFreezeTime = (until) => {
  const unitsArr = [
    parseInt(until / (60 * 60 * 24), 10), // days
    parseInt(until / (60 * 60), 10) % 24, // hours
    parseInt(until / 60, 10) % 60, // minutes
    until % 60, // seconds
  ];

  return unitsArr.map((unit) => leadingZero(unit)).join(' : ');
};
