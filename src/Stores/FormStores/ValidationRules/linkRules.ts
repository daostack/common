import {urlRegex} from '../../../Util/constants/validation';

export enum LINK_VALIDATION_RULES {
    LINKS = 'links',
  }

export const validateLink = {
  ruleName: LINK_VALIDATION_RULES.LINKS,
  validateFunc: (value: string) => new RegExp(urlRegex).test(encodeURI(value.trim())),
  errorMessage: 'Link format is invalid',
};
