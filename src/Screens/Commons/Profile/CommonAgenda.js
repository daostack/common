import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import {object, shape, string, func} from 'prop-types';
import {layout, text, font, colors} from '~/Theme';
import {useIsFocused} from '@react-navigation/native';
import {HyperText} from '~/Components/Text/HyperText';
import Title from '~/Components/CommonAgenda/Title';
import MinimumContribution from '~/Components/CommonAgenda/MinimumContribution';
import SectionDivider from '~/Components/CommonAgenda/SectionDivider';
import CommonRules from '~/Components/CommonAgenda/CommonRules';
import {commonStorePropTypes} from '~/Types/propTypes';

export const editType = {
  info: 'info',
  rules: 'rules',
};

const CommonAgenda = ({
  commonStore,
  navigation,
  route: {
    params: {commonId, canEdit, onEdit, common},
  },
}) => {
  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

  navigation.setOptions({
    title: common?.name,
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <Text style={styles.agendaTitletext}>Agenda and Rules</Text>
          <View style={layout.content}>
            <Image
              source={require('~/Assets/Common/rules.png')}
              style={styles.image}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Title
              title="About"
              onPress={() => onEdit(editType.info)}
              canEdit={canEdit}
            />
            <HyperText
              isFullWidth={true}
              textStyle={{
                ...styles.description,
                width: '100%',
                ...text.writingDirection(common?.description),
              }}>
              {common?.description}
            </HyperText>
          </View>

          {common?.links?.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={text.h3Black}>Links</Text>
              {common?.links.map((link, i) => (
                <View key={i}>
                  <Text
                    style={styles.linkText}
                    onPress={() =>
                      navigation.navigate('Browser', {
                        url: link.value || link.url,
                      })
                    }>
                    {/* NOTE: value of multiple fields was stored in url prop before */}
                    {link.title}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <CommonRules
            onEdit={() => onEdit(editType.rules)}
            canEdit={canEdit}
            rules={common?.rules}
          />

          <SectionDivider />

          <View style={styles.sectionContainer}>
            <Title title="Minimum Contribution" canEdit={false} />
            <MinimumContribution
              fundingMinimumAmount={common?.fundingMinimumAmountFormatted}
              fundingType={common?.fundingType || 'one-time'}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

CommonAgenda.propTypes = {
  commonStore: commonStorePropTypes.isRequired,
  navigation: object,
  route: shape({
    params: shape({
      common: object,
    }),
  }),
};

Title.propTypes = {
  title: string,
  onPress: func,
  canEdit: string,
};

const styles = StyleSheet.create({
  agendaTitletext: {
    ...text.h1BlackTitle,
    textAlign: 'center',
  },
  componentContainer: {
    marginBottom: 100,
  },
  container: {
    flex: 1,
  },
  image: {
    width: 170,
    height: 170,
  },
  linkText: {
    ...layout.marginTopS,
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
    textDecorationLine: 'underline',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  description: {
    ...font.primary.regular,
    ...font.fontSize(2),
    ...layout.marginTopS,
    color: colors.black,
  },
  sectionContainer: {
    ...layout.content,
    alignItems: 'flex-start',
  },
});

export default inject('commonStore')(observer(CommonAgenda));
