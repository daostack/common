import CompleteAccountFormStore from './CompleteAccountFormStore';
import FundingRequestFormStore from './FundingRequestFormStore';
import CreateDiscussionStore from './CreateDiscussionStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),
  fundingRequestFormStore: new FundingRequestFormStore(),
  createDiscussionStore: new CreateDiscussionStore(),
};
