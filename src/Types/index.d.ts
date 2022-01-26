/* eslint-disable @typescript-eslint/no-unused-vars */
import {DateSchema} from 'yup';

declare module 'yup' {
  interface DateSchema {
    validateDateFormat(message: string): DateSchema;
  }
}
