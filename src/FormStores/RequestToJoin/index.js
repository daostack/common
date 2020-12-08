import FormStore from '../FormStore';
import {paymentDetailsRules, billingDetailsRules} from '~/FormStores/ValidationRules';

export class PaymentFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(paymentDetailsRules.firstLastNameValidate);
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
  }
}

export class PersonalContributionFormStore extends FormStore {}
export class IntroduceYourselfFormStore extends FormStore {}
