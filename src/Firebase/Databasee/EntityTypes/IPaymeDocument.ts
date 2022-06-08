import {PAYME_TYPE_CODES, MIME_TYPE} from '~/Util/constants/payme';

export interface IPaymeDocument {
  name: string;
  legalType: PAYME_TYPE_CODES;
  amount: number;
  mimeType: MIME_TYPE;
  downloadURL: string;
}
