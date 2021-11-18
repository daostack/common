import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import {colors, font, layout, text} from '../../Theme';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens/index';
import {useStore} from '~/Stores';
import {ValueOf} from '~/Types';

const width = Dimensions.get('window').width;

const statuses = {
  initial: 'initial',
  loading: 'loading',
  canceled: 'canceled',
  errored: 'errored',
};

export interface CancelSubscriptionSheetScreenProps {
  onCancelConfirm(): void;
  commonName: string;
  dueDate: moment.MomentInput;
  initialStatus?: ValueOf<typeof statuses>;
}

export const CancelSubscriptionSheetScreen = ({
  dueDate,
  commonName,
  initialStatus = statuses.initial,
  onCancelConfirm,
}: CancelSubscriptionSheetScreenProps) => {
  const {
    uiStore: {bottomSheetStore},
  } = useStore();
  const [status, setStatus] = React.useState(initialStatus);

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
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET.BACKEND_ERROR, {
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
      {dueDate > new Date() ? (
        <React.Fragment>
          in {moment(dueDate).toNow(true)} ({moment(dueDate).format('DD.MM.YY')}
          )
        </React.Fragment>
      ) : (
        'in the next few days'
      )}
    </Text>
  );

  return (
    <View style={styles.body}>
      <View style={styles.slider}>
        <View style={styles.lever} />
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

              <LeaveText />
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

            <LeaveText />

            <TouchableOpacity
              style={{
                ...styles.button,
                justifyContent: 'flex-end',
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

CancelSubscriptionSheetScreen.defaultProps = {
  initialStatus: statuses.initial,
};

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
