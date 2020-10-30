import FormStore from '../FormStore';
import {firstLastNameValidate} from '~/FormStores/ValidationRules';

export class PaymentFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(firstLastNameValidate);
  }
}
export class PersonalContributionFormStore extends FormStore {}
export class IntroduceYourselfFormStore extends FormStore {}
export class BillingDetailsFormStore extends FormStore {}
