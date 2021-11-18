import {
  getCurrentUser,
  serverTimestamp,
  db,
  arrayUnion,
  Timestamp,
  increment,
  arrayRemove,
} from '~/Firebase';
import {
  ICommonEntity,
  IProposalEntity,
  IDiscussionMessageEntity,
} from '~/Types';
export interface IFollowersFeed {
  followersCount: number;
  daoCount: number;
  recentDaos: {
    [commonId in string]: {
      commentRating: number;
      comments: number;
      joined: Timestamp;
    };
  };
  followers: string[];
  membershipRequest: {
    approved: number;
    pending: number;
    rejected: number;
  };
  recentMessages: [IDiscussionMessageEntity];
  recentProposals: [IProposalEntity];
}

/**
 * Creates the followers-feed if it is not there.
 * @param targetUid
 * //https://fireship.io/courses/firestore-data-modeling/models-social-feed/
 */
export const follow = async (targetUid: string) => {
  const uid = getCurrentUser()?.uid;
  if (uid) {
    const followersDocumentRef = db.doc(`followers/${targetUid}`);
    const snap = await followersDocumentRef.get();

    const batch = db.batch();
    if (snap.exists) {
      batch.update(followersDocumentRef, 'followers', arrayUnion(uid));
      batch.update(followersDocumentRef, 'followersCount', increment(1));
    } else {
      const [commons, proposals, discussionMessages] = await Promise.all([
        db
          .collection<ICommonEntity>('commons')
          .where('members', 'array-contains', targetUid)
          .orderBy('updatedAt')
          .limit(20)
          .get(),
        db
          .collection<IProposalEntity>('proposals')
          .where('proposerId', '==', targetUid)
          .orderBy('updatedAt')
          .limit(20)
          .get(),
        db
          .collection<IDiscussionMessageEntity>('discussionMessages')
          .where('ownerId', '==', targetUid)
          .orderBy('updatedAt')
          .limit(20)
          .get(),
      ]);
      batch.set(followersDocumentRef, {
        followers: [uid],
        daoCount: commons.size,
        recentDaos: commons.docs
          .map((doc) => doc.data())
          .reduce(
            (sum, doc) => ({
              [doc.id]: doc,
              ...sum,
            }),
            {} as Record<string, ICommonEntity>,
          ),
        proposalCount: proposals.size,
        recentProposals: proposals.docs.map((doc) => doc.data()),
        recentDiscussionMessages: discussionMessages.docs.map((doc) =>
          doc.data(),
        ),
      });
    }
    const eventRef = db.doc('events');
    batch.set(eventRef, {
      createdAt: serverTimestamp(),
      id: uid,
      objectId: targetUid,
      type: 'follow',
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  }
};

export const unfollow = async (targetUid: string) => {
  const uid = getCurrentUser()?.uid;
  if (uid) {
    const followersDocumentRef = db.doc(`followers/${targetUid}`);
    const snap = await followersDocumentRef.get();

    if (snap.exists) {
      const batch = db.batch();
      batch.update(followersDocumentRef, 'followers', arrayRemove(uid));
      batch.update(followersDocumentRef, 'followersCount', increment(-1));
      const eventRef = db.doc('events');
      batch.set(eventRef, {
        createdAt: serverTimestamp(),
        id: uid,
        objectId: targetUid,
        type: 'unfollow',
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    }
  }
};
