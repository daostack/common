import {observable, computed} from 'mobx';
import {PROPOSAL_TYPE} from '~/Config';
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
  get funding() {
    if (this.type === PROPOSAL_TYPE.Join) {
      return this.join?.funding;
    } else {
      return this.fundingRequest?.amount;
    }
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
