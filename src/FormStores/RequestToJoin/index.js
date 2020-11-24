import FormStore from '../FormStore';
import {firstLastNameValidate, validateCCNumber, validDateFormat, validateCCProvider, futureDate} from '~/FormStores/ValidationRules';

export class PaymentFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(firstLastNameValidate);
    this.registerValidationRule(validateCCNumber);
    this.registerValidationRule(validateCCProvider);
    this.registerValidationRule(futureDate);
    this.registerValidationRule(validDateFormat);
  }
}
export class PersonalContributionFormStore extends FormStore {}
export class IntroduceYourselfFormStore extends FormStore {}
export class BillingDetailsFormStore extends FormStore {}
