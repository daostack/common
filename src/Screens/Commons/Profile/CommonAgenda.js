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
import moment from 'moment';

import {layout, text, font, colors} from '../../../Theme';
import {inject, observer} from 'mobx-react';

const CommonAgenda = ({daoStore, navigation}) => {

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
              source={require('../../../Assets/Common/rules.png')}
              style={styles.image}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h2Black}>About</Text>
            <Text style={styles.description}>
              {daoStore.dao.metadata.description}
            </Text>
          </View>

          {daoStore.dao.metadata.courseOfAction && <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Course of action</Text>
            <Text style={styles.description}>
              {daoStore.dao.metadata.courseOfAction}
            </Text>
          </View>}
          {daoStore.dao.metadata.links?.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={text.h3Black}>Links</Text>
              {daoStore.dao.metadata.links.map((link, i) => {
                return (
                  <View key={i}>
                    <Text
                      style={styles.linkText}
                      onPress={() =>
                        navigation.navigate('Browser', {
                          url: link.url,
                        })
                      }>
                      {link.url}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Campaign period deadline</Text>
            <Text style={styles.description}>
              {moment
                .unix(daoStore.dao.fundingGoalDeadline)
                .format('MMM DD, YYYY')}
            </Text>
          </View>

          {daoStore.dao.metadata.rules?.length > 0 && (
            <>
            <View style={styles.sectionDividerContent}>
              <View style={styles.sectionDivider} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={text.h2Black}>Rules of conduct</Text>
              {daoStore.dao.metadata.rules.map((rule, i) => {
                return (
                  <View key={i}>
                    <Text style={styles.ruleTitle}>
                      {rule.title}
                    </Text>
                    <Text
                      style={styles.ruleDescription}>
                      {rule.url}
                    </Text>
                  </View>
                );
              })}
            </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
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

export default inject('daoStore')(observer(CommonAgenda));
