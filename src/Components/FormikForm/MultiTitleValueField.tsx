import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from './TextInputField';
import {text, layout, colors, sizeL} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {ICommonRule} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {FormikProps, getIn} from 'formik';
import {
  Values as EditRulesValues,
} from '~/Components/EditCommon/EditRules';

interface RemoveBtnProps {
  onFieldDeleted: () => void,
}

const RemoveLinkBtn = ({onFieldDeleted} : RemoveBtnProps) => (
  <TouchableOpacity
    style={styles.removeBtnContainer}
    onPress={() => onFieldDeleted()}>
    <Icon name="delete" size={16} />
  </TouchableOpacity>
);

interface Props {
  formik: {formikProps: FormikProps<EditRulesValues>},
  placeholderValueText: string,
  multiline: boolean,
  addMultiFieldBtnName: string,
  maxLength: number,
  maxLengthDescription: number,
  label: string,
  title: string,
  maxCount: number,
  link: boolean,
  rule: boolean,
  onFieldDeleted: () => void,
  currRules: Array<ICommonRule>,
  onChangeText: (index: number) => void,
}

const MultiTitleValueField = (props: Props) => {
  const {
    formik,
    maxCount,
    placeholderValueText,
    multiline,
    addMultiFieldBtnName,
    maxLength,
    maxLengthDescription,
    link = false,
    rule = false,
  } = props;

  const {
    touched,
    errors,
    values,
    handleChange,
    handleBlur,
  } = formik.formikProps;

  const [count, setCount] = useState(1);
  const [addButton, setAddButton] = useState(false);
  let currRules = values?.rules || [];

  useEffect(() => {
    if (values.rules.length > 0 ) {
      setCount(values.rules?.length);
    }
    canAddMore();
  }, []);

  const onFieldDeleted = (currIndex: number) => {
    setCount(count - 1);
    values.rules.splice(currIndex, 1);
    props.onChangeText && props.onChangeText(currIndex);
  };

  const AddBtn = ({}) => (
    <TouchableOpacity>
      <Text
        style={styles.addLinkBtn}
        onPress={() => {
          setCount(count + 1);
          setAddButton(false);
        }}>
        {addMultiFieldBtnName ||
          (link ? 'Add Link' : rule ? 'Add rule' : 'Add field')}
      </Text>
    </TouchableOpacity>
  );

  const canAddMore = () => {
    let canAdd = true;
    [...Array(count).keys()].forEach((i) => {
      if (!currRules[i].value || typeof getIn(errors,`rules[${i}].value`) === 'string') {
        canAdd = false;
      }
    });

    setAddButton(canAdd);
  };

  return (
    <View style={{paddingTop: sizeL}}>
      {[...Array(count).keys()].map((currIndex) => {
        const currRuleValueName = `rules[${currIndex}].value`;
        const currRuleTitleName = `rules[${currIndex}].title`;

        return (
          <View
            key={`key_${currIndex}`}
            style={layout.marginBottomM}>
            {props.title && (

              <TextInputField
                errorMessage={errors && getIn(touched,currRuleTitleName) && getIn(errors, currRuleTitleName)}
                value={getIn(values, currRuleTitleName)}
                viewStyle={{alignSelf: 'stretch', marginTop: 0}}
                placeholderText={props.title}
                onBlur={handleBlur(currRuleTitleName)}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={handleChange(currRuleTitleName)}
                isTopPosition={true}
                multiline={multiline}
                maxLength={maxLength}
              />
            )}

              <TextInputField
                errorMessage={errors && getIn(touched,currRuleValueName) && getIn(errors, currRuleValueName)}
                value={getIn(values, currRuleValueName)}
                viewStyle={{alignSelf: 'stretch', marginTop: -5}}
                placeholderText={
                  placeholderValueText ? placeholderValueText : 'https://'
                }
                onBlur={handleBlur(currRuleValueName)}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={handleChange(currRuleValueName)}
                multiline={multiline}
                maxLength={maxLengthDescription}
              />

           {count > currIndex && (
              <View style={styles.removeBtn}>
                <RemoveLinkBtn
                  onFieldDeleted={() => onFieldDeleted(currIndex)}
                />
              </View>
            )}
          </View>
        );
      })}

      {(((!maxCount || count < maxCount) && addButton) || count === 0) && (
        <AddBtn />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  removeBtnContainer: {
    borderRadius: 15,
    width: 30,
    height: 30,
    backgroundColor: `${colors.black}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
  containerRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 80,
  },
  emailContainer: {
    ...layout.content,
    ...layout.marginBottomXL,
    marginTop: 0,
  },
  addLinkBtn: {
    ...text.h3Black,
    color: colors.mainBlue,
    textAlign: 'left',
    fontSize: 16,
  },
});

export default MultiTitleValueField;
