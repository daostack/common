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
import {text, colors} from '../Theme';
import {kFormatter} from '../Util';
const {cache} = client;
let {height, width} = Dimensions.get('window');
const mockData = {
  commonPicture: 'https://i.picsum.photos/id/10/500/100.jpg',
  numberOfProposals: 4,
  members: 142,
  raised: 1421,
  goal: 10000,
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

  return (
    <ScrollView
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
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
          <Text style={styles.headerTitle}>{mockData.name}</Text>
          <Text style={styles.headerDescription}>{mockData.description}</Text>
          <View style={styles.commonNumbers}>
            <Text style={styles.headerTitle}>
              ${mockData.raised.toLocaleString()}
            </Text>
            <Text style={styles.headerTitle}>{mockData.members}</Text>
            <Text style={styles.headerTitle}>${kFormatter(mockData.goal)}</Text>
          </View>
          <View style={styles.commonNumbers}>
            <Text style={styles.headerSmallText}>Raised</Text>
            <Text style={styles.headerSmallText}>Members</Text>
            <Text style={styles.headerSmallText}>Goal</Text>
          </View>
          <View style={styles.fundingProgressBar}>
            <View style={styles.innerProgressBar} />
          </View>
          <Text style={{...styles.headerSmallText, margin: 10}}>
            {mockData.time} days to go
          </Text>
          <View style={styles.headerButtons}>
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
      </ImageBackground>
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
          <Text style={styles.readMoreButton}>{readMore ? 'Show less' : 'Read more'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    width: '100%',
    flexDirection: 'row',
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
  headerTitle: {
    ...text.h1Black,
    color: 'white',
    marginBottom: 8,
  },
  headerDescription: {
    ...text.buttoncenterwhite,
    fontWeight: '700',
    color: 'white',
    marginBottom: 13,
  },
  headerSmallText: {
    ...text.buttoncenterwhite,
    fontSize: 12,
    color: 'white',
    marginBottom: 13,
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
