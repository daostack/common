import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import Icon from '../Assets/iconfont/Icon';
import {layout, colors, text, sizeL, sizeXXL} from '../Theme';
import {kFormatter} from '../Util';
import CommonCover from './Commons/CommonCover';
const {width} = Dimensions.get('window');

const CommonBox = props => {
  const [isMember, setIsMember] = useState(false);
  const [isFundingStage, setIsFundingStage] = useState(true);

  const renderFundingProgressBar = () => {
    if (isFundingStage) {
      return (
        <>
          <View style={styles.fundingProgressBar}>
            <View style={styles.innerProgressBar} />
          </View>
          <Text
            style={{
              ...styles.headerSmallText,
              color: colors.grey3,
              ...layout.marginTopS,
            }}>
            26 days to go
          </Text>
        </>
      );
    }
  };

  const commonNumberBox = (numberComponent, title) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.raisedContainer}>{numberComponent}</View>
        <Text style={styles.headerSmallText}>{title}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      key={props.key}
      onPress={() => {
        const navigate = CommonActions.navigate({
          name: 'CommonProfile',
          params: {
            commonId: props.common.id,
          },
        });
        props.navigation.dispatch(navigate);
      }}
      style={styles.commonBox}>
      <CommonCover
        isMember={false}
        commonInfo={{
          cover: props.image,
          logo: null,
          name: props.common.name,
          description: props.common.name,
        }}
      />

      <ImageBackground
        source={{
          uri: props.image,
        }}
        imageStyle={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        style={{
          padding: 30,
          paddingTop: 50,
          paddingBottom: 50,
          backgroundColor: 'black',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity style={{position: 'absolute', top: 12, right: 12}}>
          <Icon name="follow" size={22} color={colors.white} />
        </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={styles.logoImage}
            source={{
              uri:
                'https://yf8pn4fsld-flywheel.netdna-ssl.com/wp-content/uploads/2017/11/logo-Placeholder.png',
            }}
          />
          <Text style={{color: 'white', fontSize: 23, fontWeight: '700'}}>
            {props.common.name}
          </Text>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
            Common Description
          </Text>
        </View>
      </ImageBackground>
      {/*
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 17,
          }}>
          <Text style={styles.descriptionNumber}>
            {
              props.common.proposals.filter(
                proposal =>
                  proposal.stage !== 'Executed' &&
                  proposal.stage !== 'ExpiredInQueue',
              ).length
            }
          </Text>
          <Text style={styles.descriptionTitle}>Proposals</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 17,
          }}>
          <Text style={styles.descriptionNumber}>
            {props.common.reputationHoldersCount}
          </Text>
          <Text style={styles.descriptionTitle}>Reputation Holders</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 17,
          }}>
          <Text style={styles.descriptionNumber}>
            ${props.common.reputationHoldersCount * 1.5}
          </Text>
          <Text style={styles.descriptionTitle}>Funding</Text>
        </View>
      </View>
        */}

      <View style={styles.commonProgressContainer}>
        <View style={styles.commonNumbers}>
          {commonNumberBox(
            isFundingStage ? (
              <>
                <Text style={styles.headerTitle}>
                  $
                  {(props.common.reputationHoldersCount * 1.5).toLocaleString()}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.headerTitleLight}>
                  $
                  {(props.common.reputationHoldersCount * 1.5).toLocaleString()}
                </Text>
                <Text style={styles.headerTitle}>
                  / {kFormatter(props.common.reputationHoldersCount * 1.5)}
                </Text>
              </>
            ),
            isFundingStage ? 'Raised' : 'Available funds',
          )}
          {commonNumberBox(
            <Text style={styles.headerTitle}>144</Text>,
            'Members',
          )}
          {commonNumberBox(
            isFundingStage ? (
              <Text style={styles.headerTitle}>
                $
                {kFormatter(
                  props.common.reputationHoldersCount * 1.5,
                ).toLocaleString()}
              </Text>
            ) : (
              <Text style={styles.headerTitle}>
                {
                  props.common.proposals.filter(
                    proposal =>
                      proposal.stage !== 'Executed' &&
                      proposal.stage !== 'ExpiredInQueue',
                  ).length
                }
              </Text>
            ),
            isFundingStage ? 'Goal' : 'ActiveProposals',
          )}
        </View>
        {renderFundingProgressBar()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  commonBox: {
    width: width - 36,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.09)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 13,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eeeeee',
    marginBottom: 10,
  },
  followImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  descriptionNumber: {
    marginBottom: 4,
    fontFamily: 'HelveticaNeue',
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  descriptionTitle: {
    fontFamily: 'HelveticaNeue',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
  },

  raisedContainer: {
    ...layout.flexRow,
  },
  commonProgressContainer: {
    ...layout.content,
  },

  commonNumbers: {
    ...layout.content,
    ...layout.flexRow,
    paddingTop: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitleWhite: {
    ...text.h1Black,
    color: colors.white,
  },
  headerTitle: {
    ...text.h3Black,
  },
  headerTitleLight: {
    ...text.h3Black,
    color: colors.grey3,
  },
  headerDescription: {
    ...text.greyText,
    fontWeight: '600',
    color: colors.grey4,
  },

  fundingProgressBar: {
    width: 340,
    borderRadius: 7,
    backgroundColor: colors.grey4,
    height: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  innerProgressBar: {
    width: 380 / 4,
    borderRadius: 6,
    backgroundColor: colors.mainBlue,
    height: 8,
  },
  logoImage: {
    ...layout.marginBottomM,

    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default CommonBox;
