import {ModerationType} from '~/Graphql/Report';
import {User} from '~/Graphql';
import {last} from 'lodash';

export function getLastReport(moderation?: ModerationType): User | undefined {
  if (moderation?.reports.length) {
    return last(moderation.reports)?.reporterInfo;
  }
  return;
}
