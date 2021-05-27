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
import {object, shape, number, array, string, func} from 'prop-types';
import {layout, text, font, colors} from '~/Theme';
import {useIsFocused} from '@react-navigation/native';
import {HyperText} from '~/Components/Text/HyperText';
import Title from '~/Components/CommonAgenda/Title';
import MinimumContribution from '~/Components/CommonAgenda/MinimumContribution';
import SectionDivider from '~/Components/CommonAgenda/SectionDivider';
import CommonRules from '~/Components/CommonAgenda/CommonRules';

const CommonAgenda = ({
  // This destructuring is bloody awful
  navigation,
  route: {
    params: {common, canEdit, onEdit},
  },
}) => {
  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

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
              onPress={() => onEdit('info')}
              canEdit={canEdit}
            />
            <HyperText
              isFullWidth={true}
              textStyle={{
                ...styles.description,
                width: '100%',
                ...text.writingDirection(common.metadata.description),
              }}>
              {common.metadata.description}
            </HyperText>
          </View>

          {common.links?.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={text.h3Black}>Links</Text>
              {common.links.map((link, i) => (
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
            onEdit={() => onEdit('rules')}
            canEdit={canEdit}
            rules={common.rules}
          />

          <SectionDivider />

          <View style={styles.sectionContainer}>
            <Title title="Minimum Contribution" canEdit={false} />
            <MinimumContribution
              minFeeToJoin={common.minFeeToJoinFormatted}
              contributionType={common.metadata.contributionType || 'one-time'}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

CommonAgenda.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      common: shape({
        metadata: shape({
          description: string.isRequired,
          action: string,
          links: array,
          rules: array,
        }),
        fundingGoalDeadline: number,
      }).isRequired,
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

export default CommonAgenda;
