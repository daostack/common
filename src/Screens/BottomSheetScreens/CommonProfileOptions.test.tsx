import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import CommonProfileOptions from './CommonProfileOptions';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({insets: null}),
}));
jest.mock('@react-navigation/native');

describe('CommonProfileOptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('CommonProfileOptions should render correctly', () => {
    const mockAction = jest.fn();
    const {getByText, toJSON} = render(
      <CommonProfileOptions
        moderatorOptions={
          {
            actions: null,
            item: {
              moderation: {
                flag: 'visible',
              },
            },
          } as any
        }
        onAction={mockAction}
        hasPermission="Moderator"
        hasShare={true}
      />,
    );
    expect(getByText('Options')).not.toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  test('CommonProfileOptions should render only renderEditActions if moderatorOptions.item=null and hasShare=false', () => {
    const mockAction = jest.fn();
    const {getByText, queryByText} = render(
      <CommonProfileOptions
        moderatorOptions={
          {
            actions: null,
            item: null,
          } as any
        }
        onAction={mockAction}
        hasPermission="Moderator"
        hasShare={false}
      />,
    );
    const editInfoButton = getByText('Edit info and cover photo');
    fireEvent.press(editInfoButton);
    expect(mockAction).toHaveBeenCalledWith('info');
    const editRulesButton = getByText('Edit rules');
    fireEvent.press(editRulesButton);
    expect(mockAction).toHaveBeenCalledWith('rules');

    expect(editInfoButton).not.toBeNull();
    expect(editRulesButton).not.toBeNull();
    expect(queryByText('Share')).toBeNull();
    expect(queryByText('Copy Link')).toBeNull();
    expect(queryByText('Hide')).toBeNull();
    expect(queryByText('Report')).toBeNull();
  });

  test('CommonProfileOptions should render only renderModeratorTools if moderatorOptions.item!=null and hasShare=false', () => {
    const mockAction = jest.fn();
    const {getByText, queryByText} = render(
      <CommonProfileOptions
        moderatorOptions={
          {
            actions: null,
            item: {
              moderation: {
                flag: 'visible',
              },
            },
          } as any
        }
        onAction={mockAction}
        hasPermission="Moderator"
        hasShare={false}
      />,
    );
    const hideButton = getByText('Hide');
    fireEvent.press(hideButton);
    expect(mockAction).toHaveBeenCalledWith('Hide');
    const reportButton = getByText('Report');
    fireEvent.press(reportButton);
    expect(mockAction).toHaveBeenCalledWith('Report');

    expect(hideButton).not.toBeNull();
    expect(reportButton).not.toBeNull();
    expect(queryByText('Edit info and cover photo')).toBeNull();
    expect(queryByText('Edit rules')).toBeNull();
    expect(queryByText('Share')).toBeNull();
    expect(queryByText('Copy Link')).toBeNull();
  });

  test('CommonProfileOptions should render only renderModeratorTools without "Hide" button if user is not a moderator', () => {
    const mockAction = jest.fn();
    const {getByText, queryByText} = render(
      <CommonProfileOptions
        moderatorOptions={
          {
            actions: null,
            item: {
              moderation: {
                flag: 'visible',
              },
            },
          } as any
        }
        onAction={mockAction}
        hasPermission={null}
        hasShare={false}
      />,
    );
    const reportButton = getByText('Report');
    fireEvent.press(reportButton);
    expect(mockAction).toHaveBeenCalledWith('Report');

    expect(reportButton).not.toBeNull();
    expect(queryByText('Hide')).toBeNull();
    expect(queryByText('Edit info and cover photo')).toBeNull();
    expect(queryByText('Edit rules')).toBeNull();
    expect(queryByText('Share')).toBeNull();
    expect(queryByText('Copy Link')).toBeNull();
  });

  test('CommonProfileOptions should render renderModeratorTools and renderCommonShare if moderatorOptions.item!=null and hasShare=true', () => {
    const mockAction = jest.fn();
    const {getByText, queryByText} = render(
      <CommonProfileOptions
        moderatorOptions={
          {
            actions: null,
            item: {
              moderation: {
                flag: 'visible',
              },
            },
          } as any
        }
        onAction={mockAction}
        hasPermission="Moderator"
        hasShare={true}
      />,
    );
    const hideButton = getByText('Hide');
    fireEvent.press(hideButton);
    expect(mockAction).toHaveBeenCalledWith('Hide');
    const reportButton = getByText('Report');
    fireEvent.press(reportButton);
    expect(mockAction).toHaveBeenCalledWith('Report');
    const shareButton = getByText('Share');
    fireEvent.press(shareButton);
    expect(mockAction).toHaveBeenCalledWith('Share');
    const copyButton = getByText('Copy Link');
    fireEvent.press(copyButton);
    expect(mockAction).toHaveBeenCalledWith('Copy link');

    expect(hideButton).not.toBeNull();
    expect(reportButton).not.toBeNull();
    expect(shareButton).not.toBeNull();
    expect(copyButton).not.toBeNull();
    expect(queryByText('Edit info and cover photo')).toBeNull();
    expect(queryByText('Edit rules')).toBeNull();
  });

  test('CommonProfileOptions should render renderModeratorTools with ["FirstTestAction", "SecondTestAction"] instead of ["Hide", "Report"] if pass ["FirstTestAction", "SecondTestAction"] inside moderatorOptions.actions ', () => {
    const mockAction = jest.fn();
    const {getByText, queryByText} = render(
      <CommonProfileOptions
        moderatorOptions={
          {
            actions: ['FirstTestAction', 'SecondTestAction'],
            item: {
              moderation: {
                flag: 'visible',
              },
            },
          } as any
        }
        onAction={mockAction}
        hasPermission="Moderator"
        hasShare={false}
      />,
    );
    const firstActionButton = getByText('FirstTestAction');
    fireEvent.press(firstActionButton);
    expect(mockAction).toHaveBeenCalledWith('FirstTestAction');
    const secondActionButton = getByText('SecondTestAction');
    fireEvent.press(secondActionButton);
    expect(mockAction).toHaveBeenCalledWith('SecondTestAction');

    expect(firstActionButton).not.toBeNull();
    expect(secondActionButton).not.toBeNull();
    expect(queryByText('Edit info and cover photo')).toBeNull();
    expect(queryByText('Edit rules')).toBeNull();
    expect(queryByText('Share')).toBeNull();
    expect(queryByText('Copy Link')).toBeNull();
  });
});
