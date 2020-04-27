import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {text, layout, colors, sizeL, sizeM, sizeXS} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import MemberCard from '../../Components/MemberCard';
import ReadMore from 'react-native-read-more-text';

let {height, width} = Dimensions.get('window');
const mockData = {
  data: 'data',
  member: {
    name: 'John Smith',
    approvePercent: 32,
    imageUrl:
      'https://live.envalab.com/html/cetus/demo/images/element/team/1.jpg',
    date: 'May 12',
  },
};

const ProposalData = ({navigation}) => {
  const _renderTruncatedFooter = handlePress => {
    return (
      <Text style={styles.readMoreBtn} onPress={handlePress}>
        Show more
      </Text>
    );
  };

  const _renderRevealedFooter = handlePress => {
    return (
      <Text style={styles.readMoreBtn} onPress={handlePress}>
        Show less
      </Text>
    );
  };

  const _handleTextReady = () => {
    // ...
  };

  return (
    <View style={styles.container}>
      <View style={styles.proposalCard}>
        <View style={styles.proposalCardHeader}>
          <Icon name={'common'} color={colors.orange} />
          <Text style={text.orangeSmallBold}>Boosted</Text>
        </View>
        <View style={layout.content}>
          <View style={styles.proposalRowSubtitle}>
            <Text style={text.smallBoldGreyText}>143 votes</Text>
            <Text style={text.smallGreyText}>&nbsp;Created 3d ago</Text>
          </View>

          <View style={styles.proposalProgressInfo}>
            <View style={layout.flexRow}>
              <Icon name="common" color={colors.lightishGreen} size={22} />
              <Text style={text.lightishGreenText}>73</Text>
            </View>

            <View style={layout.flexRow}>
              <Icon name="common" color={colors.against} size={22} />
              <Text style={text.againstText}>28</Text>
            </View>
          </View>
          <View style={styles.proposalProgressBar}>
            <View style={styles.proposalInnerProgressBar} />
          </View>
        </View>
      </View>

      <View style={styles.proposalCard}>
        <View style={layout.content}>
          <View style={styles.proposalColumnSubtitle}>
            <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
              Cost
            </Text>
            <Text style={text.h1Black}>$200</Text>
          </View>

          <ReadMore
            numberOfLines={5}
            renderTruncatedFooter={_renderTruncatedFooter}
            renderRevealedFooter={_renderRevealedFooter}
            onReady={_handleTextReady}>
            <Text style={text.blackText}>
              Hello, my name is Michelle and I am the owner of the marketing
              agency MZ Studio and I propose to create a FB campaign to attract
              more members. This is divided into 3 steps: 1. Page Creation… 2.
              Advertising 3. Administration and Management I can undertake all
              the work required and have it up and running within a week.
            </Text>
          </ReadMore>
        </View>
      </View>

      <View style={styles.proposalCard}>
        <View style={layout.content}>
          <View style={styles.proposalColumnSubtitle}>
            <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
              Ad-ons
            </Text>
          </View>

          <View style={styles.adRow}>
            <Icon name="common" color={colors.mainBlue} size={22} />
            <Text style={styles.adsText}>Amazon Facebook group</Text>
          </View>

          <View style={styles.adRow}>
            <Icon name="common" color={colors.mainBlue} size={22} />
            <Text style={styles.adsText}>Facebook campaign segment.pdf</Text>
          </View>
        </View>
      </View>

      <View style={styles.proposalCard}>
        <View style={layout.content}>
          <View style={styles.proposalColumnSubtitle}>
            <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
              Recent comments
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  readMoreBtn: {
    ...text.h3Black,
    fontWeight: '500',
    ...layout.flexStart,
    ...layout.marginTopL,
    textAlign: 'left',

    color: colors.mainBlue,
  },
  container: {
    ...layout.content,
    backgroundColor: colors.paleGrey,
    paddingBottom: 130,
  },

  tabStyle: {
    ...text.ashleyjquimbacom2,
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,

    color: colors.mainBlue,
  },

  actionButtonContainer: {
    padding: 20,
    position: 'absolute',
    bottom: -80,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey2,
  },

  proposalCard: {
    ...layout.marginBottomL,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignSelf: 'stretch',

    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey4,
  },

  proposalCardHeader: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    backgroundColor: colors.orangeLight,
    padding: sizeXS,
  },

  proposalRowSubtitle: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    padding: 0,
    paddingBottom: sizeM,
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    ...layout.marginBottomL,
  },

  proposalColumnSubtitle: {
    ...layout.content,
    alignSelf: 'stretch',
    padding: 0,
    paddingBottom: sizeM,
    borderBottomWidth: 1,
    borderColor: colors.grey4,
    ...layout.marginBottomL,
  },

  proposalProgressBar: {
    width: '100%',
    borderRadius: 7,
    backgroundColor: colors.against,
    height: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    ...layout.marginTopS,
  },
  proposalInnerProgressBar: {
    width: 250,
    borderRadius: 6,
    backgroundColor: colors.lightishGreen,
    height: 8,
  },

  proposalProgressInfo: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    padding: 0,
    justifyContent: 'space-between',
  },

  adsText: {
    ...text.h3Black,
    ...layout.marginLeftXS,
    fontWeight: '500',
  },

  adRow: {
    ...layout.flexRow,
    alignSelf: 'stretch',
    paddingVertical: sizeM,
  },
});

export default ProposalData;
