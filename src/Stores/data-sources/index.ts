import {Collection, Document} from 'firestorter';
import {
  CollectionReference,
  DAO_REGISTERED,
  getCurrentUser,
  IProposalFilter,
  IProposalFilterParams,
  PROPOSAL_STAGE,
  PROPOSAL_TYPE,
} from '~/Firebase';
import {
  Proposal,
  Common,
  UserModel,
  DiscussionMessage,
  Discussion,
  Notification,
} from '../Models';

// USER
export const getUsersByIds = (userIds: string[]) =>
  new Collection<UserModel>('users', {
    query: (ref: CollectionReference) => ref.where('uid', 'in', userIds),
  });

export const getUserProposals = (
  proposerId: string,
  {stage, type}: IProposalFilterParams,
) =>
  new Collection<Proposal>('proposals', {
    query: (ref: CollectionReference) =>
      ref
        .where('proposerId', '==', proposerId)
        .where('type', '==', type)
        .where('stage', '==', stage)
        .orderBy('createdAt'),
  }).docs;

export const getUserById = (uid: string) => new UserModel(`users/${uid}`);

export const getCommonByUser = (user: UserModel) => getCommonByUserId(user.uid);

export const getCommonByUserId = (uid: string) =>
  new Collection<Common>('daos', {
    query: (ref: CollectionReference) =>
      ref.where('memberIds', 'array-contains', uid).orderBy('updatedAt'),
  }).docs;

// COMMON
export const getCommonById = (commonId: string) =>
  new Common(`daos/${commonId}`);

export const getCommonProposals = (
  commonId: string,
  {stage, type}: IProposalFilterParams,
) =>
  new Collection<Proposal>('proposals', {
    query: (ref: CollectionReference) =>
      ref
        .where('commonId', '==', commonId)
        .where('type', '==', type)
        .where('stage', '==', stage)
        .orderBy('createdAt'),
  }).docs;

export const getUserCommons = (uid?: string) => {
  uid = uid || getCurrentUser()?.uid;
  if (uid) {
    new Collection<Common>('daos', {
      query: (ref: CollectionReference) =>
        ref.where('memberIds', '==', uid).orderBy('updatedAt'),
    }).docs;
  }
  return [];
};

export const getMembers = (common: Common) =>
  getUsersByIds(common.members.map((member) => member.userId)).docs;

export const getFeaturedCommons = (excludeIds: string[]) => new Collection<Common>('daos', {
  query: (ref: CollectionReference) =>
    ref
      .where('id', 'not-in', excludeIds)
      .where('register', '==', DAO_REGISTERED)
      .orderBy('updatedAt'),
});

export const getCommonByIds = (commonIds: string[]) => new Collection<Common>('daos', {
  query: (ref: CollectionReference) =>
    ref
      .where(
        'id',
        'in',
        commonIds,
      )
      .orderBy('updatedAt'),
}).docs;


// PROPOSAL
export const getProposalById = (proposalId: string) =>
  new Proposal(`proposals/${proposalId}`);

export const getActiveProposals = () => {
  const uid = getCurrentUser()?.uid;
  if (uid) {
    return getUserProposals(uid, {
      type: PROPOSAL_TYPE.FundingRequest,
      stage: PROPOSAL_STAGE.Active,
    });
  }
  return [];
};

export const getMembershipRequests = (uid?: string) => {
  uid = uid || getCurrentUser()?.uid;
  if (uid) {
    getUserProposals(uid, {
      type: PROPOSAL_TYPE.Join,
      stage: PROPOSAL_STAGE.Active,
    });
  }
  return [];
};

export const getProposals = (filter: IProposalFilter) => {
  const {
    params: {type, stage},
  } = filter;
  switch (filter.type) {
    case 'user': {
      const proposerId = filter.uid;
      return new Collection<Proposal>('proposals', {
        query: (ref: CollectionReference) =>
          ref
            .where('proposerId', '==', proposerId)
            .where('type', '==', type)
            .where('stage', '==', stage)
            .orderBy('createdAt'),
      }).docs;
    }
    case 'common': {
      const commonId = filter.commonId;
      return new Collection<Proposal>('proposals', {
        query: (ref: CollectionReference) =>
          ref
            .where('commonId', '==', commonId)
            .where('type', '==', type)
            .where('stage', '==', stage)
            .orderBy('createdAt'),
      }).docs;
    }
  }
};

// DISCUSSION MESSAGE

export const getDiscussionMessageById = (id: string) =>
  new DiscussionMessage(`discussionMessage/${id}`);

export const getDiscussionMessagesByDiscussionId = (discussionId: string) =>
  new Collection<DiscussionMessage>('discussionsMessages', {
    query: (ref: CollectionReference) =>
      ref.where('discussionId', '==', discussionId),
  }).docs;

export const getParentDiscussion = (message: DiscussionMessage) =>
  getDiscussionById(message.discussionId) ||
  getProposalById(message.discussionId);

// DISCUSSION

export const getDiscussionById = (id: string) =>
  new Discussion(`discussions/${id}`);

export const getCommonDiscussions = (commonId: string) =>
  new Collection<Discussion>('discussions', {
    query: (ref: CollectionReference) =>
      ref.where('commonId', '==', commonId).orderBy('lastMessage'),
  }).docs;

export const getMembersDocuments = (common: Common) =>
  new Collection<UserModel>('users', {
    query: (ref: CollectionReference) =>
      ref
        .where(
          'uid',
          'in',
          common.members.map((member) => member.userId),
        )
        .orderBy('updatedAt'),
  });

// NOTIFICATIONS

export const getNotificationByUid = (uid: string) =>
  new Collection<Notification>('notifications', {
    query: (ref: CollectionReference) =>
      ref.where('userFilter', 'array-contains', uid).orderBy('createdAt'),
  }).docs;

export const getByUidAndObjectId = (uid: string, eventObjectId: string) =>
  new Collection<Notification>('notifications', {
    query: (ref: CollectionReference) =>
      ref
        .where('userFilter', 'array-contains', uid)
        .where('eventObjectId', '==', eventObjectId)
        .orderBy('createdAt'),
  }).docs;

export const proposalNotificationData = (proposalId: string) => {
  let user = null;
  let common = null;
  let proposal = getProposalById(proposalId);
  if (proposal) {
    common = getCommonById(proposal.commonId);
    user = getUserById(proposal.proposerId);
  }
  if (proposal && user && common) {
    return {
      proposal,
      common,
      user,
    };
  } else {
    return null;
  }
};

// FEED

export const getFeed = () => getCurrentUser()? new Collection<Document>('followers', {
  query: (ref:CollectionReference) => ref.where('followers', 'array-contains', getCurrentUser()!.uid).orderBy('lastMembershipRequest', 'desc')
})
// https://fireship.io/courses/firestore-data-modeling/models-social-feed/