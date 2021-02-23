import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import {text, colors, font} from '~/Theme';
import {observer} from 'mobx-react';
import {string, func, InferProps} from 'prop-types';
const {width} = Dimensions.get('window');

const getTitle = (type: string, action: string) =>
  action === 'Show'
    ? `${type} is now visible`
    : `The ${type.toLowerCase()} was successfully ${
        action === 'Hide' ? 'hidden' : 'reported'
      }`;

const getMessage = (type: string, action: string) =>
  action === 'Report'
    ? 'A moderator will review your report and make a decision soon.'
    : `The ${type.toLowerCase()} will${action === 'Show' ? ' ' : ' not '}
      be visible to members. You can undo this at any time.`;

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
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 400 : 300,
  },
  view: {
    flex: 1,
    backgroundColor: colors.white,
    width,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    alignSelf: 'center',
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
    color: colors.white,
    ...font.primary.regular,
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.mainBlue,
    marginTop: 50,
    width: '100%',
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
