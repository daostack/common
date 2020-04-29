import CompleteAccountFormStore from './CompleteAccountFormStore';
import CreateCommonFormStore from './CreateCommonFormStore';
import FundingRequestFormStore from './FundingRequestFormStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  fundingRequestFormStore: new FundingRequestFormStore(),
};
