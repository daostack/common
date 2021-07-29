import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {colors, font, sizeM} from '~/Theme';

export const PurpleBoxMessage = ({
  message,
}: {
  message: string;
}) => <View style={styles.textContainer}>
          <Text style={styles.text}>
            {message}
          </Text>
        </View>
;


const styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'center',
    borderRadius: 14,
    backgroundColor: colors.lighterBlue,
    marginBottom: sizeM,
    justifyContent: 'center',
    padding: 10,
  },
  text: {
    fontSize: 14,
    ...font.lineHeight(0),
    color: colors.slate,
    paddingHorizontal: 5,
  },
});
