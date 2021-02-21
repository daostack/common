import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import {text, colors} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {string, array, object} from 'prop-types';

const Bold = ({boldText, style = {}}) => (
  <Text style={{...styles.bold, ...style}}>{boldText}</Text>
);

const getReasons = (reasonArr) => {
  const last = reasonArr.splice(-1, 1);
  return (
    <Text style={styles.text}>
      {' due to '}
      {reasonArr.length !== 0 && (
        <>
          <Bold text={reasonArr.join(', ')} /> and{' '}
        </>
      )}
      {<Bold text={last.toString()} />}
    </Text>
  );
};

const HiddenContentInfo = ({
  userName,
  date,
  reasons,
  moderatorNote = null,
  type,
}) => (
  <View style={styles.root}>
    <View style={styles.body}>
      <Text style={styles.title}>Hidden {type}</Text>
      <Text style={styles.text}>
        This {type} was hidden by <Bold text={userName} />
        at{'\n'} <Bold text={date} /> {getReasons(reasons)}
      </Text>
      {!!moderatorNote && (
        <View style={styles.moderatorNoteContainer}>
          <View style={styles.divider} />
          <Bold
            text={'Moderator note:'}
            style={{marginBottom: 10, fontSize: 15}}
          />
          <Text style={styles.text}>{moderatorNote}</Text>
        </View>
      )}
    </View>
  </View>
);

HiddenContentInfo.propTypes = {
  userName: string,
  date: string,
  reasons: array,
  moderatorNote: string,
  type: string,
};

Bold.propTypes = {
  boldText: string,
  style: object,
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

export default inject('rootStore')(observer(HiddenContentInfo));
