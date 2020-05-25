import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

import Icon from '../Assets/iconfont/Icon';

import {layout, text, sizeS} from '../Theme';
import {inject, observer} from 'mobx-react';

const CommonAgenda = ({daoStore}) => {
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
          <View style={styles.sectionContainer}>
            <Text style={text.h1Black}>Agenda and Rules?</Text>
          </View>

          <View style={layout.content}>
            <Icon name="wallet1" size={130} />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>About</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              We aim to ba a global non-profit initiative. Only small percentage
              of creative directors are women and we want to help change this
              through mentorship circles, portfolio reviews, talks & creative
              meetups.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Course of action</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              {daoStore.dao.metadata.courseOfAction}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Links</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              https://www.google.com/
            </Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              https://www.google.co.il/
            </Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              https://www.google.ru/
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Deadline</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              April 03, 2021
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Rules</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h4Black}>No promotions or spam</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              We created this community to help you along your journey. Links to
              sponsored content or brands will vote you out.
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h4Black}>Be courteous and kind to others</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              Be courteous and kind to others
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    marginBottom: 100,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },

  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'flex-start',
  },
});

export default inject('daoStore')(observer(CommonAgenda));
