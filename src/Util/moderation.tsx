import React from 'react';
import {firebase} from '~/Firebase';
import {TouchableOpacity, Text, Modal} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {func, string, object, bool, InferProps, shape} from 'prop-types';
import {colors, text} from '~/Theme';
import {Report, HideContentSuccess} from '~/Components';
import moment from 'moment';
const _ = require('lodash');

export const ModerationMenu: React.FC<
  InferProps<typeof moderationMenuProps>
> = ({showOptions, color = ''}) => (
  <TouchableOpacity onPress={showOptions} style={{padding: 5}}>
    <Icon name="menu1" size={20} color={color} />
  </TouchableOpacity>
);

export const reporterName = (user: {firstName: string; lastName: string}) =>
  `${user?.firstName || ''} ${user?.lastName || ''}`;

export const timeReported = (updatedAt: firebase.firestore.Timestamp) =>
  updatedAt.toMillis && moment(updatedAt?.toMillis()).format('MMMM D');

export const Reported: React.FC<InferProps<typeof reportedProps>> = ({
  moderation,
  reporter,
}) => (
  <Text style={{fontSize: 15, color: colors.grey3, ...text.smallBoldGreyText}}>
    {`${_.upperFirst(moderation?.flag)} by ${reporterName(
      reporter,
    )} on ${timeReported(moderation?.updatedAt)}`}
  </Text>
);

export const ModerationModal: React.FC<
  InferProps<typeof moderationModalProps>
> = ({
  title,
  visible,
  setShowModerationModal,
  moderationFormStore,
  onReportContent,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onBackdropPress={setShowModerationModal}>
    <Report
      title={title}
      onCancel={setShowModerationModal}
      onReportContent={onReportContent}
      formStore={moderationFormStore}
    />
  </Modal>
);

export const ModerationActionSuccessModal: React.FC<
  InferProps<typeof moderationActionSuccessModalProps>
> = ({type, visible, setShowModerationSuccessModal, action}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onBackdropPress={setShowModerationSuccessModal}>
    <HideContentSuccess
      type={type}
      action={action}
      onDismiss={setShowModerationSuccessModal}
    />
  </Modal>
);

const moderationActionSuccessModalProps = {
  type: string,
  visible: bool,
  setShowModerationSuccessModal: func,
  action: func,
};

const reportedProps = {
  moderation: shape({
    updatedAt: object,
    flag: string,
  }),
  reporter: shape({
    firstName: string,
    lastName: string,
  }) ,
};

const moderationModalProps = {
  title: string,
  visible: bool,
  setShowModerationModal: func,
  moderationFormStore: func,
  onReportContent: func,
};

const moderationMenuProps = {
  showOptions: func.isRequired,
  color: string,
};

ModerationActionSuccessModal.propTypes = moderationActionSuccessModalProps;

Reported.propTypes = reportedProps;

ModerationModal.propTypes = moderationModalProps;

ModerationMenu.propTypes = moderationMenuProps;
