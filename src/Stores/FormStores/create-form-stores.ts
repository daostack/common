import {flow, makeAutoObservable} from 'mobx';
import {ContributionType, getCurrentUser, ICommonRule} from '~/Firebase';
import Logger from '~/Services/Logger';
import {escapeUrl} from '~/Util';
import {createCommon} from '../events';
import {Common} from '../Models';
import {
  AgendaFormStore,
  FundingFormStore,
  GeneralInfoFormStore,
  ReviewFormStore,
} from './CreateCommon';

interface CommonFormDataInit {
  name: string;
  image: string;
  rules: ICommonRule[];
  links: string;
  minimum: string;
  byline?: string;
  contribution: ContributionType;
  funding: string;
  description?: string;
  zeroContribution?: boolean;
}

interface ForgeCommonData extends CommonFormDataInit {
  founderId: string;
  minFeeToJoin: number;
  contributionAmount: number;
  contributionType: ContributionType;
  fundingGoal: number;
}

export class FormStores {
  generalInfoFormStore = new GeneralInfoFormStore();
  fundingFormStore = new FundingFormStore();
  agendaFormStore = new AgendaFormStore();
  reviewFormStore = new ReviewFormStore();

  forgingCommon = false;
  forgingCommonError: any = null;
  forgedCommon?: Common;

  constructor() {
    makeAutoObservable(this);
  }
  get formResults() {
    return {
      ...this.generalInfoFormStore.getChangedFormFieldsJson(),
      ...this.fundingFormStore.getChangedFormFieldsJson(),
      ...this.agendaFormStore.getChangedFormFieldsJson(),
      ...this.reviewFormStore.getChangedFormFieldsJson(),
    } as CommonFormDataInit;
  }

  forgeCommon = flow(function* (this: FormStores) {
    this.forgingCommon = true;
    try {
      const formDataInit = this.formResults;

      const contributionAmount = parseFloat(formDataInit.minimum) * 100;

      const data: ForgeCommonData = {
        ...formDataInit,
        founderId: getCurrentUser()!.uid,
        minFeeToJoin: contributionAmount,
        contributionAmount,
        contributionType: formDataInit.contribution,
        fundingGoal: parseInt(formDataInit.funding, 10) * 100,
      };
      Logger.log('calling createCommon(...)');

      this.forgedCommon = yield createCommon({
        name: data.name,
        image: data.image,
        rules: data.rules,
        links: escapeUrl(data.links),
        byline: data.byline || '',
        description: data.description || '',
        contributionType: data.contributionType,
        contributionAmount: data.contributionAmount,
        zeroContribution: !!data.zeroContribution,
      });
    } catch (e) {
      //navigation.pop();
      console.log('error -> ', e);
      this.forgingCommonError = e;
    } finally {
      this.forgingCommon = false;
    }
  });
}

export const createFormStores = (): FormStores => new FormStores();
