import FormStore from '../FormStore';
import {
  paymentDetailsRules,
  billingDetailsRules,
} from '~/FormStores/ValidationRules';

export class PaymentFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(paymentDetailsRules.validateCCNumber);
    this.registerValidationRule(paymentDetailsRules.validateCCProvider);
    this.registerValidationRule(paymentDetailsRules.futureDate);
    this.registerValidationRule(paymentDetailsRules.validDateFormat);
  }
}

export class BillingDetailsFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(billingDetailsRules.validPassport);
    this.registerValidationRule(billingDetailsRules.firstLastNameValidate);
  }
}

export class PersonalContributionFormStore extends FormStore {}
export class IntroduceYourselfFormStore extends FormStore {}
