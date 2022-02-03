import {Common} from '~/Stores/Models/Common';

export const calcShouldSkipRules = (currCommon: Common) => {
  const rules = currCommon?.rules;
  if (rules?.length > 0) {
    // NOTE: value of multiple fields was stored in url prop before
    return !rules.some((rule) => rule?.title && (rule?.value || rule.url));
  } else {
    return true;
  }
};
