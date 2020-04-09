import React, {useEffect, useState} from 'react';
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
import gql from 'graphql-tag';
import {ApolloClientConfig as client} from '../Config';
import {text, layout, colors} from '../Theme';
import {kFormatter} from '../Util';
import Icon from '../Assets/iconfont/Icon';

const {cache} = client;
let {height, width} = Dimensions.get('window');
const mockData = {
  commonPicture: 'https://i.picsum.photos/id/10/500/100.jpg',
  numberOfProposals: 4,
  raised: 1421,
  totalAmount: 20000,
  active: 55,
  approved: 142,
  name: 'Amazon Network',
  description: 'If you wanna save the Amazon, own it.',
  time: 26,
};

const CommonProfile = ({navigation}) => {
  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    // noinspection JSAnnotator
    const getDao = async () => {
      // noinspection JSAnnotator
      try {
        console.log('CACHE: ', cache.data.data);
        const res = await cache.readQuery({
          query: gql`
            query readDao($id: String!) {
              daos(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: '0x6bee9b81e434f7afce72a43a4016719315069539',
            __typename: 'DAO',
          },
        });
        console.log('HELLO!: ', res);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    getDao();
  }, []);

  const commonNumberBox = (numberComponent, title) => {
    return (
      <View>
        <View style={styles.raisedContainer}>{numberComponent}</View>
        <Text style={styles.headerSmallText}>{title}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        position: 'relative',
      }}>
      <ImageBackground
        source={{
          uri: mockData.commonPicture,
        }}
        style={styles.imageHeader}>
        <TouchableOpacity
          style={{position: 'absolute', top: 60, left: 20}}
          onPress={navigation.goBack}>
          <Image
            style={{resizeMode: 'contain', height: 20, width: 20}}
            source={require('../Assets/left-arrow-32.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{position: 'absolute', top: 60, right: 20}}>
          <Image
            style={{resizeMode: 'contain', height: 20, width: 20}}
            src={require('../Assets/menu-dots.png')}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitleWhite}>{mockData.name}</Text>
          <Text style={styles.headerDescription}>{mockData.description}</Text>
        </View>
      </ImageBackground>

      <View style={styles.commonProgressContainer}>
        <View style={styles.commonNumbers}>
          {commonNumberBox(
            <>
              <Text style={styles.headerTitleLight}>
                ${mockData.raised.toLocaleString()}
              </Text>
              <Text style={styles.headerTitle}>
                / {kFormatter(mockData.totalAmount)}
              </Text>
            </>,
            'Raised',
          )}
          {commonNumberBox(
            <>
              <Icon name="common" size={20} />
              <Text style={styles.headerTitle}>{mockData.active}</Text>
            </>,
            'Active',
          )}
          {commonNumberBox(
            <>
              <Icon name="common" size={20} />
              <Text style={styles.headerTitle}>{mockData.approved}</Text>
            </>,
            'Approved',
          )}
        </View>
        <View style={styles.fundingProgressBar}>
          <View style={styles.innerProgressBar} />
        </View>
        <Text style={{...styles.headerSmallText, margin: 10}}>
          {mockData.time} days to go
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={{
              ...styles.headerButton,
              width: 48,
              justifyContent: 'center',
              marginLeft: 18,
            }}>
            <Image
              source={require('../Assets/follow-white.png')}
              style={{...styles.image, height: 24, width: 24}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.agendaBox}>
        <Text style={styles.agendaTitle}>Agenda</Text>
        <Text style={styles.agendaDescription}>
          We are committed to doing what is necessary, not only what is
          considered politically feasible, to preserve rainforests, protect the
          climate, and uphold human rights.
        </Text>
        {readMore && (
          <Text style={styles.agendaDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        )}
        <TouchableOpacity onPress={() => setReadMore(!readMore)}>
          <Text style={styles.readMoreButton}>
            {readMore ? 'Show less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity style={styles.headerButton}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
              marginRight: 40,
            }}>
            Request to join
          </Text>
          <Text style={{fontSize: 16, color: 'white'}}>$50 fee</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  actionButtonContainer: {
    position: 'absolute',
    bottom: 0,
  },

  raisedContainer: {
    ...layout.flexRow,
  },
  commonProgressContainer: {
    ...layout.content,
  },
  agendaBox: {
    padding: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  agendaTitle: {
    ...text.runningblack,
    fontWeight: '700',
    marginBottom: 9,
  },
  agendaDescription: {
    marginBottom: 9,
  },
  readMoreButton: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.mainBlue,
  },
  commonNumbers: {
    ...layout.content,
    ...layout.flexRow,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fundingProgressBar: {
    width: 308,
    borderRadius: 7,
    backgroundColor: 'white',
    height: 14,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerButton: {
    height: 48,
    borderRadius: 32,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  innerProgressBar: {
    width: 308 / 4,
    borderRadius: 6,
    backgroundColor: colors.mainBlue,
    height: 12,
  },
  textContainer: {},
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    ...text.buttoncenterwhite,
    fontWeight: '700',
    color: 'white',
    marginBottom: 13,
  },
  headerSmallText: {
    ...text.smallBlackText,
    ...layout.marginTopS,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  imageHeader: {
    width,
    paddingLeft: 80,
    paddingRight: 50,
    paddingTop: 100,
    paddingBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommonProfile;
