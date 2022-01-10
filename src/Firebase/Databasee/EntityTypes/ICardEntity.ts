import {IBaseEntity} from './IBaseEntity';
import {IOnlyBillingDetails} from './IBillingDetailsEntity';

export interface ICardEntity extends IBaseEntity {
  id: string;
  /**
   * This is the token of the card. When creating
   * charge request we should pass this token to the provider
   */
  token: string;

  /**
   * The payment provider we'll use to charge the card
   */
  provider: string;

  /**
   * This is the ID of the user, who created the card
   */
  ownerId: string;

  /**
   * Some metadata, useful for the UI
   */
  metadata?: ICardMetadata;
}

export interface ICardMetadata {
  billingDetails: IOnlyBillingDetails;

  /**
   * The network of the card.
   * better create enums
   */
  network: 'VISA' | 'MASTERCARD' | string;

  /**
   * The last 4 digits of the card. Useful for
   * card identification by the user
   */
  digits: string;
}
