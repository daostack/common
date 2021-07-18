import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, font, layout, text} from '~/Theme';
import {string, func, array} from 'prop-types';
import Title from '~/Components/CommonAgenda/Title';
import {HyperText} from '~/Components/Text/HyperText';
import SectionDivider from '~/Components/CommonAgenda/SectionDivider';
import {CommonRule} from '~/Graphql/Common/CommonType';

type Props = {
  onEdit: () => void;
  canEdit: string;
  rules: CommonRule[];
};

const CommonRules: FC<Props> = ({onEdit, canEdit, rules}) => {
  if (!canEdit && rules?.length === 0) {
    return null;
  }

  return (
    <>
      <SectionDivider />

      <View style={styles.sectionContainer}>
        <Title title="Rules of conduct" onPress={onEdit} canEdit={canEdit} />

        {rules?.map((rule, i) => (
          <View key={i} style={{width: '100%'}}>
            <HyperText
              textStyle={{
                ...styles.ruleTitle,
                ...text.writingDirection(rule.title),
              }}>
              {rule.title}
            </HyperText>
            <HyperText
              textStyle={{
                ...styles.ruleDescription,
                ...text.writingDirection(rule.value || rule.url),
              }}>
              {rule.value || rule.url}
            </HyperText>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ruleTitle: {
    ...text.blackText,
    ...layout.marginTopM,
    color: colors.black,
  },
  ruleDescription: {
    ...layout.marginTopS,
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
  },
  sectionContainer: {
    ...layout.content,
    alignItems: 'flex-start',
  },
});

CommonRules.propTypes = {
  rules: array.isRequired,
  onEdit: func.isRequired,
  canEdit: string.isRequired,
};

export default CommonRules;
