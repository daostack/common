import {observable, computed} from 'mobx';
import {PROPOSAL_STAGE} from '~/Services/ListServices/ProposalListService';
import {BaseModel} from './BaseModel';
//import ImageSize from 'react-native-image-size';
//import {promisedComputed} from 'computed-async-mobx';
//import Logger from '~/Services/Logger';
import {ModerationType} from '~/Graphql/Report';
import {FLAGS} from '~/Components/Moderation/constants';
import {UserModel} from './UserModel';
import {
  ProposalType,
  ProposalEntity,
  ProposalJoin,
  ProposalFunding,
  JoinRequestEntity,
  FundingProposalEntity,
} from '~/Graphql/Proposal';
import {Vote} from '~/Graphql/Votes';
import {Discussion} from '~/Graphql/Discussion';

export class Proposal extends BaseModel<ProposalEntity> {
  @observable
  id: string;

  @observable
  userId: string;

  @observable
  user: UserModel;

  @observable
  commonId: string;

  @observable
  type: ProposalType;

  @observable
  votes: Vote[];

  @observable
  state: string;

  @observable
  expiresAt: Date;

  @observable
  votesFor: number;

  @observable
  votesAgainst: number;

  @observable
  paymentState?: string;

  @observable
  funding: ProposalFunding | undefined;

  @observable
  join: ProposalJoin | undefined;

  @observable
  title: string;

  @observable
  description: string;

  @observable
  discussions: Discussion[];

  @observable
  moderation?: ModerationType;

  /* @observable
  imagesPromised = promisedComputed(
    [],
    async (): Promise<IUIProposalImage[]> => {
      const tempImages: IUIProposalImage[] = [];
      if (this.images?.length) {
        await Promise.all(
          this.images.map(async (currImage: IProposalImage) => {
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
    },
  );*/

  /*@computed
  get images() {
    return this.imagesPromised.value;
  }*/

  @computed
  get isJoinRequest() {
    return this.type === ProposalType.JOIN_REQUEST;
  }

  @computed
  get isFundingRequest() {
    return this.type === ProposalType.FUNDING_REQUEST;
  }

  @computed
  get isCountdown() {
    return this.state === PROPOSAL_STAGE.countdown;
  }

  @computed
  get fundingAmount() {
    return this.type === ProposalType.JOIN_REQUEST
      ? this.join?.funding
      : this.funding?.amount;
  }

  @computed
  get fundingFormatted() {
    return (this.fundingAmount || 0) / 100;
  }

  @computed
  get progressBarWidthPercent() {
    return (this.votesFor / (this.votesFor + this.votesAgainst)) * 100;
  }

  @computed
  get votesCount() {
    return this.votesFor + this.votesAgainst;
  }

  @computed
  get isModerationHidden() {
    return this.moderation && this.moderation?.flag === FLAGS.hidden;
  }

  @computed
  get countdown() {
    return this.createdAt.getSeconds() + (this?.expiresAt.getSeconds() || 0);
  }

  constructor(newProposalInfo: ProposalEntity) {
    super(newProposalInfo);
    this.id = newProposalInfo.id;
    this.createdAt = new Date(newProposalInfo.createdAt);
    this.updatedAt = new Date(newProposalInfo.updatedAt);
    this.userId = newProposalInfo.userId;
    this.user = newProposalInfo.user;
    this.commonId = newProposalInfo.commonId;
    this.type = newProposalInfo.type;
    this.votes = newProposalInfo.votes;
    this.state = newProposalInfo.state;
    this.expiresAt = new Date(newProposalInfo.expiresAt);
    this.votesFor = newProposalInfo.votesFor;
    this.votesAgainst = newProposalInfo.votesAgainst;
    this.description = newProposalInfo.description;
    this.title = newProposalInfo.title;
    this.moderation = newProposalInfo.moderation;
    //this.images = newProposalInfo.images;
    if (this.type === ProposalType.JOIN_REQUEST) {
      this.paymentState = (newProposalInfo as JoinRequestEntity).paymentState;
      this.join = (newProposalInfo as JoinRequestEntity).join;
      // TODO: ... more props
    }
    if (this.type === ProposalType.FUNDING_REQUEST) {
      this.funding = (newProposalInfo as FundingProposalEntity).funding;
      // TODO: ... more props
    }
    this.discussions = newProposalInfo.discussions;
  }
}
