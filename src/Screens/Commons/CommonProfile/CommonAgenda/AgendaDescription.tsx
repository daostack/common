import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Common} from '~/Stores/Models/Common';
import {colors, font} from '~/Theme';
import {useNavigation} from '@react-navigation/native';
import Icon from '~/Assets/iconfont/Icon';

interface DescriptionProps {
  currCommon: Common;
}

export const AgendaDescription = (props: DescriptionProps) => {
  const navigation = useNavigation();
  const {currCommon} = props;
  const [linksVisible, setLinksVisible] = useState(false);

  const description = currCommon.metadata.description;
  const onSeeMorePress = () => {
    setLinksVisible(!linksVisible);
  };

  return (
    <View style={styles.textContainer}>
      <Text style={styles.aboutTitle}>About</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.linksContainer}>
        {linksVisible &&
          currCommon.links?.length !== 0 &&
          currCommon.links?.map((x) => (
            <View key={`key_links_${x.title}`} style={styles.iconContainer}>
              <Icon name="link" size={16} style={styles.icon} />
              <Text
                onPress={() => {
                  navigation.navigate('Browser', {url: x.value});
                }}
                style={styles.linkText}>
                {x.title}
              </Text>
            </View>
          ))}
      </View>
      {currCommon.links && currCommon.links?.length !== 0 && (
        <TouchableOpacity onPress={onSeeMorePress} style={styles.seeMoreBtn}>
          <Text style={styles.seeMore}>
            {linksVisible ? 'Hide <' : 'See more >'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  aboutTitle: {
    ...font.primary.regular,
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 8,
    color: colors.black,
  },
  description: {
    ...font.primary.regular,
    lineHeight: 20,
    fontSize: 14,
    color: colors.black,
  },
  seeMore: {
    ...font.primary.regular,
    lineHeight: 20,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: colors.black,
  },
  seeMoreBtn: {
    alignSelf: 'flex-end',
  },
  iconContainer: {
    marginTop: 16,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignContent: 'flex-start',
  },
  icon: {
    textAlign: 'right',
    alignSelf: 'center',
  },
  linksContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  linkText: {
    ...font.primary.regular,
    fontWeight: '700',
    lineHeight: 24,
    fontSize: 16,
    color: colors.black,
    textDecorationLine: 'underline',
    display: 'flex',
    alignContent: 'center',
    paddingLeft: 10,
    flexDirection: 'row',
  },
});
