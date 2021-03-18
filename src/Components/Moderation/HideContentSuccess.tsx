import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import React from 'react';
import {text, colors, font, layout} from '~/Theme';
import {observer} from 'mobx-react';
import {string, func, InferProps} from 'prop-types';
import {ACTIONS, TITLES} from './constants';
const {width} = Dimensions.get('window');

const getType = (type: string) => {
  switch (type) {
    case TITLES.discussion:
      return TITLES.post;
    default:
      return type;
  }
};

const getTitle = (type: string, action: string) => {
  switch (action) {
    case ACTIONS.show:
      return `${getType(type)} is now visible`;
    case ACTIONS.report:
      return 'Thanks for letting us know';
    default:
      return `The ${getType(type).toLowerCase()} was successfully hidden`;
  }
};

const getMessage = (type: string, action: string) =>
  action === ACTIONS.report
    ? 'We greatly appreciate it! Your feedback is important in helping us keep Common safe.'
    : `The ${getType(type).toLowerCase()} will${
        action === ACTIONS.show ? ' ' : ' not '
      }be visible to members.
      You can undo this at any time.`;

const props = {
  action: string,
  type: string,
  onDismiss: func,
};

const HideContentSuccess: React.FC<InferProps<typeof props>> = ({
  action,
  onDismiss,
  type,
}) => (
  <Pressable onPress={onDismiss}>
    <View style={styles.root}>
      <View style={styles.view}>
        <View style={styles.plug} />
        <View style={styles.body}>
          <Image
            style={styles.image}
            source={require('~/Assets/send.png')}
            width={120}
            height={120}
          />
          <Text style={styles.title}>{getTitle(type, action)}</Text>
          <Text style={styles.text}>{getMessage(type, action)}</Text>
          <Pressable onPress={onDismiss} style={{width: '100%'}}>
            <Text style={styles.button}>OK</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Pressable>
);

HideContentSuccess.propTypes = props;

const styles = StyleSheet.create({
  root: {
    paddingTop: 200,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowRadius: 100,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  view: {
    backgroundColor: colors.white,
    width,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    alignSelf: 'center',
    paddingBottom: 40,
  },
  image: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  body: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'flex-start',
    paddingVertical: 20,
    alignSelf: 'center',
    width: '85%',
  },
  title: {
    ...text.h2Black,
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  text: {
    ...text.regularText,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    ...font.primary.regular,
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    borderColor: colors.mainBlue,
    marginTop: 50,
    width: '100%',
    ...layout.btnOutline,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
  },
});

export default observer(HideContentSuccess);
