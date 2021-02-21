import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {text, colors} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {string, array} from 'prop-types';


const HideContentSuccess = ({
  type,
}) => (
  <View style={styles.root} >
    <View style={styles.body}>
      <Text style={styles.title}>The {type} was successfully hidden</Text>
      <Text style={styles.title}>The post will not be visible to members. You can undo this at any time.</Text>
    </View>
  </View>
);

HideContentSuccess.propTypes = {
  userName: string,
  date: string,
  reasons: array,
  moderatorNote: string,
  type: string,
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
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
    fontSize: 20,
  },
  text: {
    ...text.regularText,
    fontSize: 15,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey4,
    marginVertical: 30,
  },
  moderatorNoteContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
  },
});

export default inject('rootStore')(observer(HideContentSuccess));
