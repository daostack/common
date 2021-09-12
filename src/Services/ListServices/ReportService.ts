import {apollo} from '~/Util/helpers/apolloHelper';
import {
  ChangeDiscussionMessageFlagDocument,
  ChangeProposalFlagDocument,
  ChangeDiscussionFlagDocument,
  REPORT_FLAG,
  ReportResponse,
} from '~/Graphql/Report';

export const changeDiscussionMessageFlag = async (
  id: string,
  flag: REPORT_FLAG,
): Promise<ReportResponse> => {
  const {data} = await apollo.mutate({
    mutation: ChangeDiscussionMessageFlagDocument,
    variables: {
      id,
      flag,
    },
  });

  return data.changeDiscussionMessageVisibility;
};

export const changeProposalFlag = async (
  id: string,
  flag: REPORT_FLAG,
): Promise<ReportResponse> => {
  const {data} = await apollo.mutate({
    mutation: ChangeProposalFlagDocument,
    variables: {
      id,
      flag,
    },
  });

  return data.changeProposalVisibility;
};

export const changeDiscussionFlag = async (
  id: string,
  flag: REPORT_FLAG,
): Promise<ReportResponse> => {
  const {data} = await apollo.mutate({
    mutation: ChangeDiscussionFlagDocument,
    variables: {
      id,
      flag,
    },
  });

  return data.changeDiscussionVisibility;
};
