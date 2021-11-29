import {useNavigation} from '@react-navigation/native';
import React, {ReactElement} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';
import {styles} from './styles';
import {CommonFile} from '~/Types/shared';

type Props = {
  files: CommonFile[];
};

export const DiscussionHeaderFiles = ({files}: Props): ReactElement => {
  const navigation = useNavigation();

  const fileName = (url: string): string => {
    const urlSplit = url.split('_');
    return urlSplit[urlSplit.length - 2];
  };

  const navigateToBrowser = (url: string): void => {
    navigation.navigate('Browser', {
      url,
    });
  };

  return (
    <>
      {files &&
        files.map((f, index) => (
          <View style={styles.adRow} key={`discussion_file_${index}`}>
            <Icon name="file" color={colors.mainBlue} size={16} />
            <TouchableOpacity onPress={() => navigateToBrowser(f.url)}>
              <Text style={styles.adsText}>{fileName(f.value)}</Text>
            </TouchableOpacity>
          </View>
        ))}
    </>
  );
};
