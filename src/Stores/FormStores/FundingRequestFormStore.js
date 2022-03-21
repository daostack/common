import FormStore from './FormStore';
import {proposalRules} from './ValidationRules';

class FundingRequestFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(proposalRules.validateMaxAmount);
  }
}

export default FundingRequestFormStore;
