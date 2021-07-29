import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {colors, text, layout, font} from '~/Theme';
import {string, func, InferProps, shape} from 'prop-types';
import TextInputField from '~/Components/FormFields/TextInputField';
import * as ModerationForm from '~/Components/Forms/ModerationForm';
import {TITLES} from '~/Components/Moderation/constants';
const {width} = Dimensions.get('window');

const reasons = [
  ['Nudity', 'Violence', 'Harassment'],
  ['False News', 'Spam', 'Hate speech'],
  ['Something Else'],
];

const proposalReason = 'Violates the Common\nagenda';

const reportProps = {
  title: string,
  onCancel: func,
  formStore: shape({
    registerFormField: func.isRequired,
    getFormField: func.isRequired,
    fieldChanged: func.isRequired,
    isFormValid: func.isRequired,
  }).isRequired,
  onReportContent: func,
  hasPermission: string,
};

const Report: React.FC<InferProps<typeof reportProps>> = ({
  title,
  onCancel,
  formStore,
  onReportContent,
  hasPermission,
}) => {
  if (title === TITLES.proposals && !reasons[2].includes(proposalReason)) {
    // this reason should only be displayed for proposals
    reasons[2].push(proposalReason);
  }
  const [chosen, setChosen] = useState(['']);
  const [isValid, setIsValid] = useState(false);
  formStore.registerFormField(ModerationForm.REASONS, 'required', []);

  const problemButton = (chosenProblem: string) => (
    <TouchableOpacity
      key={chosenProblem}
      style={{
        ...styles.problemButton,
        backgroundColor: chosen.includes(chosenProblem)
          ? colors.mainBlue
          : colors.white,
      }}
      onPress={() => onProblemPressed(chosenProblem)}>
      <Text
        style={{
          ...styles.problemText,
          color: chosen.includes(chosenProblem) ? colors.white : colors.black,
        }}>
        {chosenProblem}
      </Text>
    </TouchableOpacity>
  );

  const onProblemPressed = (chosenProblem: string) => {
    let currProblems =
      `${formStore.getFormField(ModerationForm.REASONS, false)?.value}` || [];
    if (currProblems.length) {
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
    formStore.fieldChanged(
      ModerationForm.REASONS,
      currProblems.toString(),
      false,
    );
    setIsValid(formStore.isFormValid(true));
  };

  const isValidNote = (note: string) =>
    setIsValid(note ? formStore.isFormValid(true) : false);

  return (
    <View style={styles.root}>
      <View style={styles.view}>
        <ScrollView style={{marginHorizontal: 24}}>
          <Text style={styles.title}>Report {title}</Text>

          <Text style={styles.action}>Please select a problem to continue</Text>
          <Text style={styles.explanation}>
            You can hide the post after selecting a problem
          </Text>
          <View style={{paddingVertical: 20}}>
            {reasons.map((reasonRow, i) => (
              <View key={i} style={{flexDirection: 'row'}}>
                {reasonRow.map((reason) => problemButton(reason))}
              </View>
            ))}
          </View>
          <View style={styles.divider} />
          <TextInputField
            label={hasPermission ? 'Moderator note' : 'Add note:'}
            placeholderText="This note is public and will be shown to all members."
            multiline={true}
            infoLabel="Required"
            value={
              formStore.getFormField(ModerationForm.MODERATOR_NOTE, false)
                ?.value
            }
            onChangeText={(noteText: string) => isValidNote(noteText)}
            validation={{
              name: 'moderatorNote',
              formStore: formStore,
              validateRule: 'string|required',
              displayName: 'moderator note',
            }}
          />
          <Pressable onPress={onReportContent} disabled={!isValid}>
            <Text style={[styles.button, isValid && styles.buttonSelected]}>
              Report
            </Text>
          </Pressable>
          <Pressable onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

Report.propTypes = reportProps;

const styles = StyleSheet.create({
  root: {
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 200 : 100,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowRadius: 100,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    paddingHorizontal: 15,
    ...layout.marginTopS,
    marginRight: 5,
  },
  problemText: {
    ...font.primary.regular,
    fontSize: 15,
    textAlign: 'center',
  },
  title: {
    ...text.h2Black,
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 30,
  },
  action: {
    ...font.primary.bold,
    fontSize: 15,
    marginBottom: 10,
    marginVertical: 30,
  },
  explanation: {
    ...font.primary.regular,
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
    marginVertical: 5,
  },
  cancel: {
    color: colors.slate,
    ...font.primary.regular,
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.mainBlue,
    marginVertical: 5,
  },
  buttonSelected: {
    color: colors.white,
    backgroundColor: colors.mainBlue,
  },
});

export default Report;
