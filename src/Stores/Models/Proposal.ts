import {observable, computed} from 'mobx';
import {PROPOSAL_TYPE} from '~/Config';
import {PROPOSAL_STAGE} from '~/Services/ListServices/ProposalListService';
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
import {promisedComputed} from 'computed-async-mobx';

export class Proposal extends BaseModel<IProposalEntity> {
  @observable
  id: string;

  @observable
  proposerId: string;

  @observable
  commonId: string;

  @observable
  type: ProposalType;

  @observable
  votes: IProposalVote[];

  @observable
  state: string;

  @observable
  countdownPeriod: number;

  @observable
  quietEndingPeriod: number;

  @observable
  votesFor: number;

  @observable
  votesAgainst: number;

  @observable
  paymentState?: string;

  @observable
  fundingRequest: IProposalFundingRequest | undefined;

  @observable
  join: IProposalJoin | undefined;

  @observable
  description: IFundingRequestDescription | IJoinReqDescription;

  @observable
  imagesPromised = promisedComputed(
    [],
    async (): Promise<IUIProposalImage[]> => {
      console.log('promisedComputed');
      const tempImages: IUIProposalImage[] = [];
      if (this.description.images?.length) {
        await Promise.all(
          this.description.images.map(async (currImage: IProposalImage) => {
            if (currImage.value) {
              const {width, height} = await ImageSize.getSize(currImage.value);
              tempImages.push({
                title: currImage.title,
                widthRatio: (width / height) * 220,
                uri: currImage.value,
              } as IUIProposalImage);
            }
          }),
        );
      }
      return tempImages;
    },
  );

  @computed
  get images() {
    return this.imagesPromised.value;
  }

  @computed
  get isJoinRequest() {
    return this.type === PROPOSAL_TYPE.Join;
  }

  @computed
  get isFundingRequest() {
    return this.type === PROPOSAL_TYPE.FundingRequest;
  }

  @computed
  get isCountdown() {
    return this.state === PROPOSAL_STAGE.countdown;
  }

  @computed
  get funding() {
    if (this.type === PROPOSAL_TYPE.Join) {
      return this.join?.funding;
    } else {
      return this.fundingRequest?.amount;
    }
  }

  @computed
  get fundingFormatted() {
    return this.funding / 100;
  }

  @computed
  get progressBarWidthPercent() {
    return (this.votesFor / (this.votesFor + this.votesAgainst)) * 100;
  }

  @computed
  get votesCount() {
    return this.votesFor + this.votesAgainst;
  }

  constructor(newProposalInfo: IProposalEntity) {
    super();
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
    if (this.type === PROPOSAL_TYPE.Join) {
      this.paymentState = (newProposalInfo as IJoinRequestProposal).paymentState;
      this.join = (newProposalInfo as IJoinRequestProposal).join;
      // TODO: ... more props
    }
    if (this.type === PROPOSAL_TYPE.FundingRequest) {
      this.fundingRequest = (newProposalInfo as IFundingRequestProposal).fundingRequest;
      // TODO: ... more props
    }
  }
}
