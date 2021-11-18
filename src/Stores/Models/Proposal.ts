import {fromPromise} from 'mobx-utils';
import ImageSize from 'react-native-image-size';
import Logger from '~/Services/Logger';
import {FLAGS} from '~/Components/Moderation/constants';
import {
  IFundingRequestDescription,
  IFundingRequestProposal,
  IJoinRequestProposal,
  IProposalEntity,
  PROPOSAL_TYPE,
  PROPOSAL_STAGE,
} from '~/Types/EntityTypes/IProposalEntity';
import {Timestamp} from '~/Firebase';
import {BaseDocument} from './base-document';
import {getCurrentUser} from './auth';

async function getImage(uri: string, title?: string) {
  try {
    const {width, height} = await ImageSize.getSize(uri);
    return {
      title: title,
      widthRatio: (width / height) * 220,
      uri,
    };
  } catch (err) {
    Logger.warn(
      `An error occurred while processing proposal image with url: ${uri} , skipping the image!`,
      err,
    );
  }
}

export class Proposal extends BaseDocument<IProposalEntity> {
  get proposerId() {
    return this.data.proposerId;
  }

  get commonId() {
    return this.data.commonId;
  }

  get type() {
    return this.data.type;
  }

  get votes() {
    return this.data.votes;
  }

  get state() {
    return this.data.state;
  }

  get countdownPeriod() {
    return this.data.countdownPeriod;
  }

  get quietEndingPeriod() {
    return this.data.quietEndingPeriod;
  }

  get votesFor() {
    return this.data.votesFor;
  }

  get votesAgainst() {
    return this.data.votesAgainst;
  }

  get paymentState() {
    if (this.type === PROPOSAL_TYPE.Join) {
      return (this.data as IJoinRequestProposal).paymentState;
    }
  }

  get fundingRequest() {
    if (this.type === PROPOSAL_TYPE.FundingRequest) {
      return (this.data as IFundingRequestProposal).fundingRequest;
    }
  }

  get join() {
    if (this.type === PROPOSAL_TYPE.Join) {
      return (this.data as IJoinRequestProposal).join;
    }
  }

  get description() {
    return this.data.description;
  }

  get moderation() {
    return this.data.moderation;
  }

  get images() {
    if (this.type === PROPOSAL_TYPE.FundingRequest) {
      return (this.data.description as IFundingRequestDescription).images;
    }
  }

  get imagesPromised() {
    return fromPromise(
      this.images
        ? Promise.all(
            this.images
              ?.filter((image) => !!image.value)
              .map((image) => getImage(image.value, image.title)),
          )
        : Promise.resolve([]),
    );
  }

  get isJoinRequest() {
    return this.type === PROPOSAL_TYPE.Join;
  }

  get isFundingRequest() {
    return this.type === PROPOSAL_TYPE.FundingRequest;
  }

  get isCountdown() {
    return this.state === PROPOSAL_STAGE.countdown;
  }

  get funding() {
    if (this.type === PROPOSAL_TYPE.Join) {
      return (this.data as IJoinRequestProposal).join.funding;
    } else {
      return (this.data as IFundingRequestProposal).fundingRequest.amount;
    }
  }

  get fundingFormatted() {
    return this.funding / 100;
  }

  get progressBarWidthPercent() {
    return (this.votesFor / (this.votesFor + this.votesAgainst)) * 100;
  }

  get votesCount() {
    return this.votesFor + this.votesAgainst;
  }

  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }

  get countdown() {
    //TODO: rewrite this better:
    if (this.moderation) {
      if (this.moderation.quietEnding) {
        return this.moderation.quietEnding;
      }
      return (
        ((this.moderation?.updatedAt as unknown) as Timestamp).seconds +
        (this.moderation.countdownPeriod || 0)
      );
    }
    return this._createdAt.seconds + this.countdownPeriod;
  }
  get proposerIsOwner() {
    return this.proposerId === getCurrentUser()?.uid;
  }

  get isReported() {
    return this.moderation?.flag !== FLAGS.visible;
  }
}
