import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React from 'react';

import Icon from '../../Assets/iconfont/Icon';
import {layout, colors, text} from '../../Theme';

const SentTemplate = ({
  children,
  title,
  description,
  onClose,
  isCommonCreation,
}) => {
  return (
    <>
      <SafeAreaView />
      <View style={styles.headerSafeArea}>
        <TouchableOpacity style={styles.closeBtn}>
          <Icon name="close" color={colors.black} size={12} onPress={onClose} />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.container}>
        <View style={layout.marginBottomXL}>
          <Image
            source={
              isCommonCreation
                ? require('../../Assets/launch.png')
                : require('../../Assets/sent_igraphic.png')
            }
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {children}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    ...layout.content,
    padding: 0,
  },
  title: {
    ...text.h1Black,
  },
  description: {
    ...text.blackText,
    ...layout.marginTopM,
    textAlign: 'center',
  },
  closeBtn: {
    ...layout.content,
    padding: 5,
  },
  headerSafeArea: {
    ...layout.content,
    alignItems: 'flex-end',
  },
});

export default SentTemplate;
