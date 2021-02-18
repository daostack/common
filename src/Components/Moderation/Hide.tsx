import React, {useState} from 'react';
import {Text, View, ScrollView, Pressable, Dimensions, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {colors, text, layout, font} from '~/Theme';
import {string, func, object, InferProps} from 'prop-types';
import TextInputField from '~/Components/FormFields/TextInputField';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
const {width} = Dimensions.get('window');

const reasons = [['Nudity', 'Violence', 'Harassment'], ['False News', 'Spam', 'Hate speech'], ['Something Else']];

const Hide: React.FC<InferProps<typeof Hide.propTypes>> = ({
  title,
  onCancel,
  formStore,
  onHideContent,
}) => {
  const [chosen, setChosen] = useState(['']);
  const [isValid, setIsValid] = useState(false);
  formStore.registerFormField(ModerationForm.REASONS, 'required', []);

  const problemButton = (chosenProblem: string) => (
    <TouchableOpacity key={chosenProblem} style={{...styles.problemButton, backgroundColor: chosen.includes(chosenProblem) ? colors.mainBlue : colors.white}}
      onPress={() => onProblemPressed(chosenProblem) }>
      <Text style={{...styles.problemText, color: chosen.includes(chosenProblem) ? colors.white : colors.black}} >{chosenProblem}</Text>
    </TouchableOpacity>
  );

  const onProblemPressed = (chosenProblem: string) => {
    let currProblems = `${formStore.getFormField(ModerationForm.REASONS, false)?.value}` || [];
    if (currProblems.length !== 0) {
      currProblems = currProblems.split(',');
      if (!currProblems.includes(chosenProblem)) {
        currProblems = [...currProblems, chosenProblem];
      } else {
        currProblems.splice(currProblems.indexOf(chosenProblem), 1);
      }
    } else {
      currProblems.push(chosenProblem);
    }
    setChosen(currProblems);
    formStore.fieldChanged(ModerationForm.REASONS, currProblems.toString(), false);
    setIsValid(formStore.isFormChanged() && formStore.isFormValid(true));
  };

  return <Pressable onPress={onCancel}>
    <View style={styles.root} >
      <View style={styles.view} >
       <ScrollView style={{marginHorizontal: 24}} >
          <Text style={styles.title} >{title}</Text>

          <Text style={styles.action} >Please select a problem to continue</Text>
          <Text style={styles.explanation} >You can hide the post after selecting a problem</Text>
          <View style={{paddingVertical: 20}} >
            {reasons.map((reasonRow) => <View style={{flexDirection: 'row'}}>
              {reasonRow.map((reason) => problemButton(reason) )}
            </View> )}
          </View>
          <View style={styles.divider} />
          <TextInputField
            label="Moderator note:"
            placeholderText="This note is public and will be shown to all members."
            multiline={true}
            value={formStore.getFormField(ModerationForm.NOTE, false)?.value}
            validation={{
              name: 'moderatorNote',
              formStore: formStore,
              validateRule: 'string',
              displayName: 'moderator note',
            }}
          />
          <Pressable
            onPress={onHideContent}
            disabled={!isValid}>
            <Text
              style={[
                styles.button,
                isValid && styles.buttonSelected,
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
  formStore: object,
  onHideContent: func,
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
