import {BaseType} from '~/Graphql/BaseType';
import {PERMISSIONS_GRAPHQL} from '~/Util/constants/permissions.enum';

export type CommonType = BaseType & {
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

  /**
   * The currently available funds of
   * the common in cents
   */
  balance: number;

  /**
   * The total amount of funds that the
   * common has raised to date in cents
   */
  raised: number;

  /**
   * List of all users, that are members of this common
   */
  members: CommonMemberType[];

  /**
   * List of the rules, that a member must agree
   * to be a part if the common
   */
  rules: CommonRule[];

  /**
   * List of links, that the common provided
   */
  links: ICommonLink[];

  /**
   * The minimum amount in cents, required
   * to join the common
   */
  fundingMinimumAmount: number;

  /**
   * Used to showcase whether the common is whitelisted
   *
   * false - The common is not whitelisted and thus visible only to members
   * true - The common is whitelisted and part of the featured list
   */

  whitelisted: boolean;

  /**
   * Whether the user should be charged every
   * month, that they are member of the common,
   * or only when they join
   */
  fundingType: ContributionType;

  /**
   * The id of the user, who created the common
   */
  founderId: string;

  action: string;
  byline: string;
  description: string;
};

export interface CommonRule {
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

export type ContributionType = 'one-time' | 'monthly';

export type CommonMemberType = {
  userId: string;
  joinedAt?: Date;
  roles: Array<PERMISSIONS_GRAPHQL>;
};
