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
          <View style={styles.sectionContainer}>
            <Text style={text.h1Black}>Agenda and Rules</Text>
          </View>

          <View style={layout.content}>
            <Icon name="wallet1" size={130} />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>About</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              {daoStore.dao.metadata.description}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Course of action</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              {daoStore.dao.metadata.courseOfAction}
            </Text>
          </View>

          {daoStore.dao.metadata.links?.length > 0 && <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Links</Text>
              {daoStore.dao.metadata.links.map((link, i) => {
                return (<>
                    <Text key={i} style={{...text.blackText, ...layout.marginTopM}}>
                      {link.title}
                    </Text>
                    <Text key={i} style={{...text.blackText, ...layout.marginTopM, textDecorationLine: 'underline'}} onPress={() => navigation.navigate('Browser', {url: link.description})}>
                      {link.description}
                    </Text>
                  </>
                )
              })}
          </View>}

          <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Deadline</Text>
            <Text style={{...text.blackText, ...layout.marginTopM}}>
              {daoStore.dao.fundingGoalDeadline.toDate().toString()}
            </Text>
          </View>

          {daoStore.dao.metadata.rules?.length > 0 && <View style={styles.sectionContainer}>
            <Text style={text.h3Black}>Rules</Text>
            {daoStore.dao.metadata.rules.map((rule, i) => {
              return (<>
                <Text key={i} style={{...text.blackText, ...layout.marginTopM}}>
                  {rule.title}
                </Text><Text key={i} style={{...text.blackText, ...layout.marginTopM}}>
                  {rule.description}
                </Text>
              </>
              );
            })}
          </View> }

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
