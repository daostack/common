import React from 'react';
import {ContributionItem} from './ContributionItem';
import {render} from '@testing-library/react-native';

describe('ContributionItem', () => {
  const createdDate = new Date('10-20-2022');
  const formattedDate = '20 October 2022';
  const amount = 100;

  test('ContributionItem should render correctly', () => {
    const {getByText, toJSON} = render(
      <ContributionItem createdAt={createdDate} amount={amount} />,
    );
    expect(getByText('One-time Contribution')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  test('ContributionItem should format date correctly', () => {
    const {getByText} = render(
      <ContributionItem createdAt={createdDate} amount={amount} />,
    );
    expect(getByText(formattedDate)).not.toBeNull();
  });

  test('ContributionItem should hide Invalid date', () => {
    const {queryByText} = render(
      <ContributionItem createdAt={new Date('')} amount={amount} />,
    );

    expect(queryByText(formattedDate)).toBeNull();
  });
});
