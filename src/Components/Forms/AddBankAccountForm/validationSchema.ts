import moment from 'moment';
import {addMethod, date, DateSchema, mixed, number, object, string} from 'yup';
import {DATE_FORMAT} from '~/Util/constants/date';

function validateDateFormat(msg: string): any {
  return mixed().test({
    name: 'validateDate',
    exclusive: false,
    message: msg,
    test(value) {
      const formattedDate = moment(value, DATE_FORMAT);
      if (value?.length < 10) {
        return false;
      }
      if (moment().diff(formattedDate) < 0) {
        return false;
      }
      return formattedDate.isValid();
    },
  });
}

addMethod<DateSchema>(date, 'validateDateFormat', validateDateFormat);

export const validationSchema = object({
  socialId: number()
    .label('ID Number')
    .typeError('ID Number must contain only numbers')
    .required(),
  socialIdIssueDate: date()
    .validateDateFormat('Invalid date')
    .label('ID Issuance day')
    .required(),
  birthdate: date()
    .validateDateFormat('Invalid date')
    .label('Birth Date')
    .required(),
  gender: number()
    .label('Gender')
    .min(0, 'Gender is a required field')
    .required(),
  bankName: string().label('Bank Name').required(),
  branchNumber: number()
    .typeError('Branch Number must contain only numbers')
    .label('Branch Number')
    .required(),
  phoneNumber: number()
    .typeError('Phone Number must contain only numbers')
    .label('Phone Number')
    .required(),
  // TODO: Add when API will allow sent email with body
  // email: string().email().label('Email').required(),
  accountNumber: number()
    .typeError('Bank Account Number must contain only numbers')
    .label('Bank Account Number')
    .required(),
  bankCode: number().label('Bank Code').required(),
  country: string().label('Country').required(),
  city: string().label('City').required(),
  streetAddress: string().label('Street Address').required(),
  streetNumber: number()
    .typeError('House Number must contain only numbers')
    .label('House Number')
    .required(),
  photoID: object()
    .shape({
      downloadURL: string().required(),
    })
    .label('PhotoID')
    .required(),
  bankConfirmation: object()
    .shape({
      downloadURL: string().required(),
    })
    .label('Bank Confirmation')
    .required(),
});
