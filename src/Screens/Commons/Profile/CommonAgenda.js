import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
} from 'react-native';
import {object, shape, number, array, string} from 'prop-types';
import {layout, text, font, colors} from '~/Theme';

const CommonAgenda = ({
  // This destructuring is bloody awful
  navigation,
  route: {
    params: {
      common: {
        metadata,
        ...common
      },
    },
  },
}) => (
  <>
    <StatusBar barStyle="dark-content"/>
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
          <Text style={text.h2Black}>About</Text>
          <Text style={{
            ...styles.description, width: '100%',
            ...text.writingDirection(metadata.description),
          }}>
            {metadata.description}
          </Text>
        </View>

        {metadata.links?.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Links</Text>
            {metadata.links.map((link, i) => (
              <View key={i}>
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    navigation.navigate('Browser', {
                      url: link.value || link.url,
                    })
                  }>
                  {/* NOTE: value of multiple fields was stored in url prop before */}
                  {link.value || link.url}
                </Text>
              </View>
            ))}
          </View>
        )}

        {(metadata.action) && (
          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>
              Course of action
            </Text>

            <Text
              style={{
                ...styles.description,
                ...text.writingDirection(metadata.action),
                width: '100%',
              }}
            >
              {metadata.action}
            </Text>
          </View>
        )}

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
                  {link.value || link.url}
                </Text>
              </View>
            ))}
          </View>
        )}

        {common.rules?.length > 0 && (
          <React.Fragment>
            <View style={styles.sectionDividerContent}>
              <View style={styles.sectionDivider}/>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={text.h2Black}>Rules of conduct</Text>

              {common.rules.map((rule, i) => (
                <View key={i} style={{width: '100%'}}>
                  <Text style={{
                    ...styles.ruleTitle,
                    ...text.writingDirection(rule.title),
                  }}>
                    {rule.title}
                  </Text>
                  <Text
                    style={{
                      ...styles.ruleDescription,
                      ...text.writingDirection(rule.value || rule.url),
                    }}>
                    {rule.value || rule.url}
                  </Text>
                </View>
              ))}
            </View>
          </React.Fragment>
        )}
      </ScrollView>
    </SafeAreaView>
  </>
);

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
  ruleTitle: {
    ...text.blackText,
    ...layout.marginTopM,
    color: colors.black,
  },
  sectionDividerContent: {
    paddingHorizontal: 20,
  },
  sectionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.grey4,
    ...layout.paddingLeftL,
    ...layout.paddingRightL,
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

export default CommonAgenda;
