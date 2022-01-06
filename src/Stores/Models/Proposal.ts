import {makeAutoObservable} from 'mobx';
import {PROPOSAL_TYPE} from '~/Config';
import {PROPOSAL_STAGE} from '~/Services/ProposalService';
import {
  IFundingRequestProposal,
  IJoinRequestProposal,
  IProposalEntity,
  IProposalFundingRequest,
  IProposalJoin,
  IProposalVote,
  ProposalType,
  IProposalImage,
  IUIProposalImage,
  IJoinReqDescription,
  IFundingRequestDescription,
} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {BaseModel} from './BaseModel';
import ImageSize from 'react-native-image-size';
import Logger from '~/Services/Logger';
import {IModerationEntity} from '~/Firebase/Databasee/EntityTypes/IModerationEntity';
import {FLAGS} from '~/Components/Moderation/constants';
import {fromPromise} from 'mobx-utils';
import {firebase} from '~/Firebase';

export class Proposal implements BaseModel<IProposalEntity> {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  proposerId: string;
  commonId: string;
  type: ProposalType;
  votes: IProposalVote[];
  state: string;
  countdownPeriod: number;
  quietEndingPeriod: number;
  votesFor: number;
  votesAgainst: number;
  paymentState?: string | null = null;
  fundingRequest: IProposalFundingRequest | undefined | null = null;
  join: IProposalJoin | undefined | null = null;
  description: IFundingRequestDescription | IJoinReqDescription;
  moderation?: IModerationEntity | null = null;

  imagesPromised = fromPromise(
    (async (): Promise<IUIProposalImage[]> => {
      const tempImages: IUIProposalImage[] = [];
      if (this.description?.images.length) {
        await Promise.all(
          this.description.images.map(async (currImage: IProposalImage) => {
            if (currImage.value) {
              let currImageEntity: IUIProposalImage | null = null;
              try {
                const {width, height} = await ImageSize.getSize(
                  currImage.value,
                );

                currImageEntity = {
                  title: currImage.title,
                  widthRatio: (width / height) * 220,
                  uri: currImage.value,
                } as IUIProposalImage;
              } catch (err) {
                Logger.warn(
                  `An error occured while processing proposal image with url: ${currImage.value} , skippiing the image!`,
                  err,
                );
              }

              if (currImageEntity) {
                tempImages.push(currImageEntity);
              }
            }
          }),
        );
      }
      return tempImages;
    })(),
  );

  get images() {
    return this.imagesPromised.value;
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
      return (this as IJoinRequestProposal).join.funding;
    } else {
      return (this as IFundingRequestProposal).fundingRequest.amount;
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
    return (
      this.moderation?.quietEnding ||
      this.moderation?.updatedAt.seconds + this.moderation?.countdownPeriod ||
      this.createdAt.seconds + this?.countdownPeriod
    );
  }

  constructor(newProposalInfo: IProposalEntity) {
    this.id = newProposalInfo.id;
    this.createdAt = newProposalInfo.createdAt;
    this.updatedAt = newProposalInfo.updatedAt;
    this.proposerId = newProposalInfo.proposerId;
    this.commonId = newProposalInfo.commonId;
    this.type = newProposalInfo.type;
    this.votes = newProposalInfo.votes;
    this.state = newProposalInfo.state;
    this.countdownPeriod = newProposalInfo.countdownPeriod;
    this.quietEndingPeriod = newProposalInfo.quietEndingPeriod;
    this.votesFor = newProposalInfo.votesFor;
    this.votesAgainst = newProposalInfo.votesAgainst;
    this.description = newProposalInfo.description;
    this.moderation = newProposalInfo.moderation;
    if (this.type === PROPOSAL_TYPE.Join) {
      this.paymentState = (
        newProposalInfo as IJoinRequestProposal
      ).paymentState;
      this.join = (newProposalInfo as IJoinRequestProposal).join;
      // TODO: ... more props
    }
    //if (this.type === PROPOSAL_TYPE.FundingRequest) {
    this.fundingRequest = (
      newProposalInfo as IFundingRequestProposal
    ).fundingRequest;
    // TODO: ... more props
    //}
    makeAutoObservable(this);
  }
}
