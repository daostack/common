import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {object, shape, number, array, string, func, bool} from 'prop-types';
import {layout, text, font, colors} from '~/Theme';
import {useIsFocused} from '@react-navigation/native';
import Icon from '~/Assets/iconfont/Icon';

const Title = ({title, onPress, canEdit}) => (
  <View style={styles.titleContainer}>
    <Text style={styles.titleText}>{title}</Text>
    {canEdit && (
      <TouchableOpacity style={styles.editText} onPress={() => onPress()}>
        <Icon
          style={{marginTop: 2}}
          size={16}
          name="edit-16"
          color={colors.black}
        />
        <Text style={{...text.h3Black, marginLeft: 5}}>Edit</Text>
      </TouchableOpacity>
    )}
  </View>
);

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
            <Text
              style={{
                ...styles.description,
                width: '100%',
                ...text.writingDirection(common.metadata.description),
              }}>
              {common.metadata.description}
            </Text>
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
                        url: decodeURIComponent(link.value || link.url),
                      })
                    }>
                    {/* NOTE: value of multiple fields was stored in url prop before */}
                    {link.title}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {common.rules?.length > 0 && (
            <React.Fragment>
              <View style={styles.sectionDividerContent}>
                <View style={styles.sectionDivider} />
              </View>

              <View style={styles.sectionContainer}>
                <Title
                  title="Rules of conduct"
                  onPress={() => onEdit('rules')}
                  canEdit={canEdit}
                />

                {common.rules.map((rule, i) => (
                  <View key={i} style={{width: '100%'}}>
                    <Text
                      style={{
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
  canEdit: bool,
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleText: {
    ...text.h2Black,
    paddingVertical: 7,
  },
  editText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
  },
});

export default CommonAgenda;
