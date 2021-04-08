import {observer} from 'mobx-react';
import React, {ReactElement} from 'react';
import {StyleSheet, Text} from 'react-native';
import {colors, font, layout} from '~/Theme';

type Props = {
  multiName?: string;
  errorMessage?: string | boolean;
  invisibleContainer?: boolean;
};

function ValidationMessage({
  errorMessage,
  invisibleContainer,
}: Props): ReactElement {
  return errorMessage || !invisibleContainer ? (
    <Text
      style={{
        ...styles.errorMessage,
        ...(!invisibleContainer && {minHeight: font.lineHeightForm}),
      }}>
      {errorMessage || ''}
    </Text>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    color: colors.error,
    ...layout.marginBottomS,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
});

export default observer(ValidationMessage);
