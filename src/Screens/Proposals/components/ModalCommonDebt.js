import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {colors, layout} from '~/Theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {func, object} from 'prop-types';

const ModalCommonDebt = ({onPressClose, children}) => (
  <Pressable onPress={() => onPressClose()} style={styles.background}>
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
  background: {
    width: '100%',
    // backgroundColor: colors.blackOpacity,
  },
  root: {
    paddingTop: 100,
    height: '100%',
    justifyContent: 'flex-end',
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
});

export default ModalCommonDebt;
