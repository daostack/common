import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import moment from 'moment';
import {inject, observer} from 'mobx-react';

import {colors, font, layout, text} from '../../Theme';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens/index';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 350,
    justifyContent: 'space-between',
  },

  container: {
    alignItems: 'center',
  },

  image: {
    height: 150,
    aspectRatio: 1,
  },

  title: {
    ...font.primary.bold,
    ...font.fontSize(4),
    marginVertical: 5,
  },

  subTitle: {
    ...text.regularText,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: width * 0.8,
  },

  bold: {
    ...font.primary.bold,
  },

  button: {
    ...layout.btnOutline,
    width: width * 0.9,
    textAlign: 'center',
    marginVertical: 8,
    maxHeight: 48,
    alignSelf: 'center',
    color: colors.black,
  },

  stayText: {
    color: colors.black,
  },

  cancelText: {
    color: colors.error,
  },

  slider: {
    width,
    height: 60,
    marginTop: -20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  lever: {
    borderColor: colors.grey4,
    borderWidth: 2.5,
    width: width * 0.2,
    borderRadius: 10,
  },
  loader: {
    marginVertical: 30,
  },

  spacer: {
    flex: 1,
  },
});

const statuses = {
  initial: 'initial',
  loading: 'loading',
  canceled: 'canceled',
  errored: 'errored',
};

const CancelSubscriptionSheetScreen = ({
                                         dueDate,
                                         commonName,
                                         initialStatus,
                                         onCancelConfirm,
                                         bottomSheetStore,
                                       }) => {
  const [ status, setStatus ] = React.useState(initialStatus);

  const onClose = () => {
    bottomSheetStore.hideBottomSheet();
  };

  const onCancel = async () => {
    setStatus(statuses.loading);

    try {
      await onCancelConfirm();

      setStatus(statuses.canceled);
    } catch (e) {
      bottomSheetStore.hideBottomSheet();
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.BACKEND_ERROR, {
        subTitle: 'Try again later',
        titleRed: true,
        error: e,
      });
    }
  };

  const LeaveText = () => (
    <Text style={styles.subTitle}>
      {status === statuses.canceled
        ? 'You will leave'
        : 'If you cancel, you will leave'}{' '}
      <Text style={styles.bold}>{commonName} </Text>
      {dueDate > new Date() && ' in '}
      {moment(dueDate).toNow(true, 'd')}
      {dueDate < new Date() && ' ago'}{'  '}
      ({moment(dueDate).format('DD.MM.YY')})
    </Text>
  );

  return (
    <View style={styles.body}>
      <View style={styles.slider}>
        <View style={styles.lever}/>
      </View>

      <View style={styles.content}>
        {status === statuses.initial && (
          <React.Fragment>
            <View style={styles.container}>
              <Image
                source={require('../../Assets/cardDeclined.png')}
                style={styles.image}
              />

              <Text style={styles.title}>Cancel payment</Text>

              <LeaveText/>
            </View>

            <View style={styles.container}>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.stayText}>Stay a member</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel anyway</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        )}

        {status === statuses.loading && (
          <View style={styles.container}>
            <ActivityIndicator
              size="large"
              color={colors.mainBlue}
              style={styles.loader}
            />

            <Text style={styles.title}>Canceling...</Text>
          </View>
        )}

        {status === statuses.canceled && (
          <React.Fragment>
            <Image
              source={require('../../Assets/paymentCancelled.png')}
              style={styles.image}
            />

            <Text style={styles.title}>Recurring payment canceled</Text>

            <LeaveText/>

            <TouchableOpacity
              style={{
                ...styles.button,
                justifySelf: 'flex-end',
                marginTop: 'auto',
              }}
              onPress={onClose}>
              <Text style={styles.stayText}>OK</Text>
            </TouchableOpacity>
          </React.Fragment>
        )}

        {status === statuses.errored && <Text>Something bad happened!</Text>}
      </View>
    </View>
  );
};

CancelSubscriptionSheetScreen.propTypes = {
  onCancelConfirm: PropTypes.func.isRequired,
  commonName: PropTypes.string.isRequired,
  dueDate: PropTypes.instanceOf(Date).isRequired,
  initialStatus: PropTypes.oneOf([ ...Object.values(statuses) ]),

  bottomSheetStore: PropTypes.shape({
    hideBottomSheet: PropTypes.func,
    showBottomSheet: PropTypes.func,
  }),
};

CancelSubscriptionSheetScreen.defaultProps = {
  initialStatus: statuses.initial,
};

export default inject('bottomSheetStore')(
  observer(CancelSubscriptionSheetScreen)
);
