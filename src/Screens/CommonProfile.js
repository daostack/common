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
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import ViewTabNoData from '../Components/ViewTabNoData';

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
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'discussions', title: 'Discussions'},
    {key: 'proposals', title: 'Proposals'},
    {key: 'history', title: 'History'},
  ]);

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

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.mainBlue,
      }}
      renderLabel={({route, focused, color}) => {
        return (
          <View style={{...layout.content, padding: 0}}>
            <Icon
              name="common"
              size={30}
              color={focused ? colors.mainBlue : colors.grey3}
            />
            <Text style={focused ? styles.tabStyleActive : styles.tabStyle}>
              {route.title}
            </Text>
          </View>
        );
      }}
      style={{backgroundColor: colors.white}}
      tabStyle={{borderTopWidth: 1, borderColor: colors.grey4}}
    />
  );

  const commonNumberBox = (numberComponent, title) => {
    return (
      <View>
        <View style={styles.raisedContainer}>{numberComponent}</View>
        <Text style={styles.headerSmallText}>{title}</Text>
      </View>
    );
  };

  const Discussions = () => {
    return (
      <ViewTabNoData
        title="No Discussions"
        subtitle="Have things in common? This is the place to talk about them."
      />
    );
  };

  const Proposals = () => {
    return (
      <ViewTabNoData
        title="No proposals yet"
        subtitle="Write your first proposals and invite members to make an impact together!"
      />
    );
  };

  const History = () => {
    return (
      <ViewTabNoData
        title="No Past activity"
        subtitle="You will be able to see proposals that passed or were rejected here."
      />
    );
  };

  const renderScene = SceneMap({
    discussions: Discussions,
    proposals: Proposals,
    history: History,
  });

  const openAgendaScreen = e => {
    navigation.navigate('CommonAgenda');
  };

  const openCommonMembers = e => {
    navigation.navigate('CommonMembers');
  };

  const shareCommon = event => {
    console.log('TODO: share functionality');
  };

  const initialLayout = {width: Dimensions.get('window').width};

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
        <Text
          style={{...styles.headerSmallText, margin: 10, color: colors.grey3}}>
          {mockData.time} days to go
        </Text>
      </View>

      <TouchableOpacity
        onPress={openCommonMembers}
        style={styles.membersContainer}>
        <View style={styles.membersRow}>
          <Image
            style={styles.memberImage}
            source={{
              uri:
                'https://live.envalab.com/html/cetus/demo/images/element/team/1.jpg',
            }}
          />
          <Image
            style={{...styles.memberImage, ...{marginLeft: -10}}}
            source={{
              uri:
                'https://live.envalab.com/html/cetus/demo/images/element/team/2.jpg',
            }}
          />
          <Image
            style={{...styles.memberImage, ...{marginLeft: -10}}}
            source={{
              uri:
                'https://live.envalab.com/html/cetus/demo/images/element/team/3.jpg',
            }}
          />
          <Image
            style={{...styles.memberImage, ...{marginLeft: -10}}}
            source={{
              uri:
                'https://live.envalab.com/html/cetus/demo/images/element/team/4.jpg',
            }}
          />
        </View>
        <TouchableOpacity style={layout.flexRow}>
          <Text style={text.h4Black}>Pending (13)</Text>
          <Icon name="right-arrow" />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={{...layout.content, ...{paddingVertical: 0}}}>
        <TouchableOpacity
          style={{
            ...layout.btnOutline,
          }}
          onPress={shareCommon}>
          <Text style={text.buttonblue}>Share Common</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.agendaBox}>
        <Text style={styles.agendaDescription}>
          We aim to ba a global non-profit initiative. Only small percentage of
          creative directors are women and we want to help change this through
          mentorship circles, portfolio reviews, talks & creative meetups.
        </Text>

        <TouchableOpacity onPress={openAgendaScreen}>
          <Text style={styles.readMoreButton}>
            View agenda and rules of conduct
          </Text>
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
        style={{}}
      />

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
          <Text style={{fontSize: 16, color: 'white'}}>$50 Contribution</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
  membersRow: {
    ...layout.flexRow,
  },
  membersContainer: {
    ...layout.content,
    ...layout.flexRow,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.grey4,
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

  raisedContainer: {
    ...layout.flexRow,
  },
  commonProgressContainer: {
    ...layout.content,
  },
  agendaBox: {
    padding: 20,
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
    color: colors.black,
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
    backgroundColor: colors.grey4,
    height: 8,
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
    height: 8,
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
