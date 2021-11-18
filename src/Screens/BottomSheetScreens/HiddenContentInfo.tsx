import {Text, View, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {text, colors} from '~/Theme';
import {Bold} from '~/Components/Text';

const getReasons = (reasonArr: string[]) => {
  if (reasonArr.length) {
    const clone = reasonArr.slice();
    const last = clone.splice(-1, 1);
    return (
      <Text style={styles.text}>
        {' due to '}
        {clone.length !== 0 && (
          <>
            <Bold boldText={clone.join(', ')} /> and{' '}
          </>
        )}
        {<Bold boldText={last.toString()} />}
      </Text>
    );
  }
};

export interface HiddenContentInfoProps {
  userName: string;
  date: string;
  reasons: string[];
  moderatorNote?: string;
  type: string;
  isModerator: boolean;
}

export const HiddenContentInfo = ({
  userName,
  date,
  reasons,
  moderatorNote,
  type,
  isModerator,
}: HiddenContentInfoProps) => (
  <View style={styles.root}>
    <ScrollView contentContainerStyle={{paddingBottom: 100}}>
      <View style={{...styles.body, height: moderatorNote ? '90%' : '60%'}}>
        <Text style={styles.title}>Hidden {type}</Text>
        <Text style={styles.text}>
          This {type} was hidden
          {isModerator ? ' by ' : ''}
          <Bold boldText={isModerator ? userName : ''} /> at{'\n'}{' '}
          <Bold boldText={date} /> {getReasons(reasons)}
        </Text>
        {!!moderatorNote && (
          <View style={styles.moderatorNoteContainer}>
            <View style={styles.divider} />
            <Bold
              boldText={'Moderator note:'}
              style={{marginBottom: 10, fontSize: 15}}
            />
            <Text style={{...styles.text, textAlign: 'left'}}>
              {moderatorNote}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center',
    height: '100%',
  },
  body: {
    flex: 1,
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
  divider: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grey4,
    marginVertical: 20,
  },
  moderatorNoteContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
  },
});
