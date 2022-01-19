import FormStore from '../FormStore';
import {
  paymentDetailsRules,
  billingDetailsRules,
  customAmountRules,
} from '~/Stores/FormStores/ValidationRules';

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
    this.registerValidationRule(billingDetailsRules.latinOnly);
  }
}

export class PersonalContributionFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(customAmountRules.validateCustomAmount);
  }
}
export class IntroduceYourselfFormStore extends FormStore {}
