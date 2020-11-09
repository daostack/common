import FormStore from '../FormStore';
import {firstLastNameValidate, validateCCNumber, validateCCProvider} from '~/FormStores/ValidationRules';

export class PaymentFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(firstLastNameValidate);
    this.registerValidationRule(validateCCNumber);
    this.registerValidationRule(validateCCProvider);
  }
}
export class PersonalContributionFormStore extends FormStore {}
export class IntroduceYourselfFormStore extends FormStore {}
export class BillingDetailsFormStore extends FormStore {}
