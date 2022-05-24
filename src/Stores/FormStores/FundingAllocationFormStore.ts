import FormStore from './FormStore';
import {proposalRules} from './ValidationRules';

class FundingAllocationFormStore extends FormStore {
  constructor() {
    super();
    this.registerValidationRule(proposalRules.validateMaxAmount);
  }
}

export default FundingAllocationFormStore;
