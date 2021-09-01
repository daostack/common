import {ModerationType} from '~/Graphql/Report';
import {User} from '~/Graphql';
import {MessageReport} from '~/Graphql/Report';
import {last} from 'lodash';

export function getLastReporterInfo(
  moderation?: ModerationType,
): User | undefined {
  if (moderation?.reports.length) {
    return last(moderation.reports)?.reporterInfo;
  }
  return;
}

export function getLastReport(
  moderation?: ModerationType,
): MessageReport | undefined {
  if (moderation?.reports.length) {
    return last(moderation.reports);
  }
  return;
}
