import React, {useState, useEffect} from 'react';
import {Text, View, ScrollView, Pressable, Linking, Dimensions, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {colors, text, layout, font, sizeL, sizeLineHeight} from '~/Theme';
import {string, func, object, shape, array, InferProps} from 'prop-types';
import TextInputField from '~/Components/FormFields/TextInputField';
import ModerationFormStore from '../../FormStores/ModerationFormStore';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
const {width} = Dimensions.get('window');

const problems = [['Nudity', 'Violence', 'Harassment'], ['False News', 'Spam', 'Hate speech'], ['Something Else']];

const Hide: React.FC<InferProps<typeof Hide.propTypes>> = ({
  title,
  onCancel,
}) => {
  const [done, setDone] = useState(false);
  const [moderationFormStore] = useState(new ModerationFormStore());
  const [chosen, setChosen] = useState(['']);
  moderationFormStore.registerFormField(ModerationForm.PROBLEM, 'string');

  const Problem = ({text, row, col}) => (
    <TouchableOpacity style={{...styles.problemButton, backgroundColor: chosen.includes(text) ? colors.mainBlue : colors.white}}
      onPress={() => onProblemPressed(text, row, col) }>
      <Text style={{...styles.problemText, color: chosen.includes(text) ? colors.white : colors.black}} >{text}</Text>
    </TouchableOpacity>
  );

  const onProblemPressed = (text, row, col) => {
    let currProblems: any[] = [...moderationFormStore.getFormField(ModerationForm.PROBLEM, false)?.value]; 
    if (currProblems) {
      if (!currProblems.includes(text)) {
        currProblems = [...currProblems, text];
      } else {
        currProblems.splice(currProblems.indexOf(text), 1);
      }
    } else {
      currProblems.push(text);
    }
    setChosen(currProblems);
    moderationFormStore.fieldChanged(ModerationForm.PROBLEM, currProblems, false);
  };

  return <Pressable onPress={onCancel}>
    <View style={styles.root} >
      <View style={styles.view} >
       <ScrollView style={{marginHorizontal: 24}} >
          <Text style={styles.title} >{title}</Text>

          <Text style={styles.action} >Please select a problem to continue</Text>
          <Text style={styles.explanation} >You can hide the post after selecting a problem</Text>
          <View style={{paddingVertical: 20}} >
            {problems.map((problemRow, row) => <View style={{flexDirection: 'row'}}>
              {problemRow.map((problem, col) => <Problem text={problem} row={row} col={col} />)}
            </View> )}
          </View>
          <View style={styles.divider} />
          <TextInputField
            label="Moderator note:"
            placeholderText="This note is public and will be shown to all members."
            multiline={true}
            validation={{
              name: 'moderatorNote',
              formStore: moderationFormStore,
              validateRule: 'required',
              displayName: 'moderator note',
            }}
          />
          <Pressable onPress={() => setDone(true)} disabled={!done}>
            <Text
              style={[
                styles.button,
                done && styles.buttonSelected,
              ]}>
              Hide
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  </Pressable>;
};

Hide.propTypes = {
  title: string,
  onCancel: func,
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 200 : 100,
  },
  view: {
    flex: 1,
    backgroundColor: colors.white,
    width,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    alignSelf: 'center',
  },
  problemButton: {
    borderWidth: 1,
    borderRadius: 28,
    borderColor: colors.grey4,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...layout.marginTopS,
    marginRight: 10,
  },
  problemText: {
    ...font.primary.regular,
    fontSize: 16,
  },
  title: {
    ...text.h2Black,
    //borderWidth: 1,
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 30,
  },
  action: {
    ...font.primary.bold,
    //borderWidth: 1,
    fontSize: 15,
    marginBottom: 10,
    marginVertical: 30,
  },
  explanation: {
    ...font.primary.regular,
    //borderWidth: 1,
    fontSize: 15,
  },
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.grey4,
  },
  button: {
    color: colors.slate,
    ...font.primary.regular,
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.paleblue,
    //marginBottom: 40,
    marginVertical: 40,
  },
  buttonSelected: {
    color: colors.white,
    backgroundColor: colors.mainBlue,
  },

});

export default Hide;
