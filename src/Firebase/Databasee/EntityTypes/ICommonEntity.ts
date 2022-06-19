import {IBaseEntity} from './IBaseEntity';
import {firebase} from '~/Firebase';

export interface ICommonEntity extends IBaseEntity {
  /**
   * Common creator id
   */
  userId: string;

  founderId: string;

  /**
   * The name of the common showed in the app and
   * other places (email, notification etc.)
   */
  name: string;

  /**
   * The URL of the image, used as header for
   * the common profile page
   */
  image: string;

  byline: string;

  description: string;

  /**
   * List of links, that the common provided
   */
  links: ICommonLink[];

  searchable: boolean;
}

export interface ICommonRule {
  /**
   * The title for the rule
   */
  title: string;

  /**
   * The description of the rule
   */
  value: string;

  /**
   * The url of the rule
   */
  url: string;
}

export interface ICommonLink {
  /**
   * The title of the link
   */
  title: string;

  /**
   * The address, to which the link is pointing
   */
  value: string;
}

export interface CommonCreatedBody {
  userId: string;
  name: string;
  image: string;
  byline: string;
  links: ICommonLink[];
  description: string;
}

export interface CommonImmediateContributionBody {
  amount: number;
  commonId: string;
  contributionType: string;
  saveCard: boolean;
}
