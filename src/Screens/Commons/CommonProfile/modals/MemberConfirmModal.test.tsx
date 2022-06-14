import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {MemberConfirmModal} from '~/Screens/Commons/CommonProfile/modals/MemberConfirmModal';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: mockedNavigate}),
}));

describe('MemberConfirmModal', () => {
  const closeModal = jest.fn();
  const createdProposalId = '1';

  test('MemberConfirmModal should render correctly', () => {
    const {getByText, toJSON} = render(
      <MemberConfirmModal
        showRequestSentModal={true}
        closeModal={closeModal}
        createdProposalId={createdProposalId}
      />,
    );
    expect(getByText('Membership request sent')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  test('MemberConfirmModal click on "View request" should navigate to ProposalScreen', () => {
    const {getByText} = render(
      <MemberConfirmModal
        showRequestSentModal={true}
        closeModal={closeModal}
        createdProposalId={createdProposalId}
      />,
    );
    const button = getByText('View request');
    fireEvent.press(button);
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('ProposalScreen', {
      proposalId: createdProposalId,
    });
  });
});
