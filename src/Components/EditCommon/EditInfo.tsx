import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {text, layout, font, sizeL, sizeLineHeight} from '~/Theme';
import {shape, func, InferProps, string} from 'prop-types';
import CommonImage from '~/Components/Commons/CommonImage';
import TextInputField from '~/Components/FormFields/TextInputField';
import * as EditCommonConstants from '~/Components/Forms/EditCommonForm';
const {width} = Dimensions.get('window');

const EditInfo: React.FC<InferProps<typeof EditInfo.propTypes>> = ({
  isValidChange,
  common,
  editCommonFormStore,
}) => {
  const textInputAttributes = [
    {
      value:
        editCommonFormStore.getFormField(EditCommonConstants.NAME)?.value ||
        common.name,
      label: 'Common name',
      maxLength: 49,
      infoLabel: 'Required',
      validation: {
        name: EditCommonConstants.NAME,
        formStore: editCommonFormStore,
        validateRule: 'required',
        displayName: 'common name',
      },
    },
    {
      value:
        editCommonFormStore.getFormField(EditCommonConstants.BYLINE)?.value ||
        common?.metadata.byline,
      label: 'Tagline',
      numberOfLines: 3,
      multiline: true,
      maxLength: 89,
      validation: {
        name: EditCommonConstants.BYLINE,
        formStore: editCommonFormStore,
        validateRule: 'string',
        displayName: 'tagline',
      },
    },
    {
      value:
        editCommonFormStore.getFormField(EditCommonConstants.DESCRIPTION)
          ?.value || common?.metadata.description,
      label: 'About',
      numberOfLines: 5,
      multiline: true,
      validation: {
        name: EditCommonConstants.DESCRIPTION,
        formStore: editCommonFormStore,
        validateRule: 'string',
        displayName: 'about',
      },
    },
  ];

  return (
    <View style={styles.body}>
      <Text style={styles.subtitle}>
        Describe your cause and let the community learn more about your plans
        and goals
      </Text>
      <CommonImage
        width={width}
        reviewFormStore={editCommonFormStore}
        commonName={common.name}
        commonByLine={common?.metadata.byline}
        currImage={common.image}
        onImageChanged={() => isValidChange()}
      />

      {textInputAttributes.map((attributes, i) => (
        <TextInputField
          key={i}
          viewStyle={{alignSelf: 'stretch'}}
          placeholderText=""
          returnKeyType="next"
          onChangeText={() => isValidChange()}
          autoCorrect={false}
          {...attributes}
        />
      ))}
    </View>
  );
};

EditInfo.propTypes = {
  isValidChange: func,
  common: shape({
    name: string,
    metadata: shape({
      byline: string,
      description: string,
    }),
  }),
  editCommonFormStore: shape({
    getFormField: func,
  }),
};

const styles = StyleSheet.create({
  btn: {
    ...layout.btnPrimary,
    width: '85%',
    alignSelf: 'center',
  },
  body: {
    ...layout.content,
  },
  subtitle: {
    ...text.greyText,
    ...layout.marginTopS,
    marginBottom: sizeL,
    textAlign: 'center',
    ...font.fontSize(2),
    ...font.primary.regular,
    lineHeight: sizeLineHeight,
  },
});

export default EditInfo;
