import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {colors, layout} from '~/Theme';
import {func, object} from 'prop-types';
import {BlurView} from '@react-native-community/blur';

const ModalCommonDebt = ({onPressClose, children}) => (
  <Pressable onPress={() => onPressClose()}>
    <BlurView
      style={styles.blurView}
      blurType="light"
      blurAmount={1}
      reducedTransparencyFallbackColor={colors.blackOpacity}
    />
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.view}>
          <View style={styles.plug} />
          <ScrollView contentContainerStyle={styles.content}>
            <Image
              style={styles.piggyBank}
              source={require('~/Assets/debt-funds.png')}
              width={116}
              height={116}
            />
            {children}
            <TouchableOpacity
              style={{
                ...styles.btns,
                ...layout.btnOutline,
                ...layout.marginRightS,
              }}
              onPress={onPressClose}>
              <Text>OK</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </Pressable>
);

ModalCommonDebt.propTypes = {
  onPressClose: func,
  children: object,
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 100,
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: colors.blackOpacity,
  },
  view: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
  },
  content: {
    marginHorizontal: 24,
  },
  piggyBank: {
    height: 116,
    width: 116,
    alignSelf: 'center',
    marginBottom: 16,
  },
  btns: {
    marginVertical: 40,
  },
  blurView: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },
});

export default ModalCommonDebt;
