import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import moment from 'moment';
import {inject, observer} from 'mobx-react';

import {text, layout, font} from '../../Theme';

const SafetyPeriodAbout = ({bottomSheetStore, activationDate}) => {
  const onClose = () => {
    bottomSheetStore.hideBottomSheet();
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../Assets/closed.png')} style={styles.img} />

      <Text style={styles.title}>When can I create proposals?</Text>

      <Text style={styles.text}>
        This Common was recently created.{'\n'}
        To allow more members to participate in the decision-making process,
        proposals are currently disabled.
      </Text>

      <View style={{...layout.marginVerticalL}}>
        <Text style={styles.text}>You will be able to create proposals</Text>

        <Text style={{...styles.text, ...text.bold}}>
          {moment.unix(activationDate).fromNow()}
        </Text>
      </View>

      <TouchableOpacity
        style={{...layout.btnOutline, maxHeight: 56}}
        onPress={onClose}>
        <Text>Got it!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  img: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },

  title: {
    ...text.centered,
    ...text.h1Black,
    ...layout.marginTopL,
    ...layout.marginBottomL,
  },

  text: {
    ...text.regularText,
    ...text.centered,
    ...font.fontSize(3),
  },
});

SafetyPeriodAbout.propTypes = {
  bottomSheetStore: PropTypes.object.isRequired,
  activationDate: PropTypes.number.isRequired,
};

export default inject('bottomSheetStore')(observer(SafetyPeriodAbout));
