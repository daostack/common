import {DateSchema} from 'yup';

declare module 'yup' {
  interface DateSchema {
    validateDateFormat(message: string): DateSchema;
  }
}
