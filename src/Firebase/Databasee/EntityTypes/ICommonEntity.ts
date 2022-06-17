import {IBaseEntity} from './IBaseEntity';
import {firebase} from '~/Firebase';
import {COMMON_REGISTERED} from '~/Shared/enums/commonRegistered';
import {COMMON_STATE} from '~/Shared/enums/commonState';

export interface ICommonEntity extends IBaseEntity {
  /**
   * The name of the common showed in the app and
   * other places (email, notification etc.)
   */
  name: string;

  byline: string;

  description: string;

  /**
   * The URL of the image, used as header for
   * the common profile page
   */
  image: string;

  /**
   * List of links, that the common provided
   */
  links: ICommonLink[];

  /**
   * Will this common appear in the search results page
   */
  searchable: boolean;

  /**
   * The currently available funds of
   * the common in cents
   */
  balance: number;

  /**
   * Reserved amount that is due to leave the common
   * until the process of payout is completed
   */
  reservedBalance: number;

  /**
   * The total amount of funds that the
   * common has raised to date in cents
   */
  raised: number;

  /**
   * Number of proposals in common
   */
  proposalCount: number;

  /**
   * Number of discussions in common
   */
  discussionCount: number;

  /**
   * Number of messages in all the discussions of the common
   */
  messageCount: number;

  memberCount: number;

  /**
   * The whitelisting status of the common
   */
  register: COMMON_REGISTERED;

  readonly governanceId: string | null;

  readonly founderId: string;

  state: COMMON_STATE;
  /**
   * Score of common for prioritization purposes
   */
  score: number;
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
