import {PAYME_TYPE_CODES} from '~/Util/constants/payme';

export interface DocInfo {
  name: string;
  legalType: PAYME_TYPE_CODES;
  amount: number;
  mimeType: string;
  downloadURL: string;
}
