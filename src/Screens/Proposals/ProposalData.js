import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {text, layout, colors, sizeM, sizeXS} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import ReadMore from 'react-native-read-more-text';
import UserMessageCard from '../../Components/Discussion/UserMessageCard';
import ImageView from 'react-native-image-viewing';
import firestore from '@react-native-firebase/firestore';
import DiscussionMessage from '../Discussions/DiscussionMessage';
import {useNavigation} from '@react-navigation/native';

const ProposalData = props => {
  const navigation = useNavigation();
  const mockData = {
    images: [
      {
        id: '0',
        title: 'Alejandro Escamilla',
        width: 5616,
        height: 3744,
        uri: 'https://picsum.photos/id/0/5616/3744',
      },
      {
        id: '10',
        title:
          'I tool this photo in my back yard and i think this is the perfect cover photo for our campaign. I have other good suggestions but this is free and we will have no copyright issues since it’s my photo',
        width: 2400,
        height: 3840,
        uri: 'https://www.ecopetit.cat/wpic/mpic/86-868861_nature-portrait.jpg',
      },

      {
        id: '10',
        title:
          'I tool this photo in my back yard and i think this is the perfect cover photo for our campaign. I have other good suggestions but this is free and we will have no copyright issues since it’s my photo',
        width: 4200,
        height: 2667,
        uri: 'https://picsum.photos/id/10/2500/1667',
      },
      {
        id: '1',
        title: 'Alejandro Escamilla',
        width: 5616,
        height: 3744,
        uri: 'https://picsum.photos/id/1/5616/3744',
      },
      {
        id: '100',
        title: 'Tina Rataj',
        width: 2500,
        height: 1656,
        uri: 'https://picsum.photos/id/100/2500/1656',
      },
    ],

    discussions: [
      {
        ownerName: 'John Smith',
        text: 'How can I help?',
        ownerAvatar:
          'https://live.envalab.com/html/cetus/demo/images/element/team/1.jpg',
        // createTime: firestore.FieldValue.serverTimestamp(),
        // createTime: '152117989365',
      },
      {
        ownerName: 'John Smith',
        text: 'Why now?',
        ownerAvatar:
          'https://live.envalab.com/html/cetus/demo/images/element/team/2.jpg',
        // createTime: '152117989365',
      },
      {
        ownerName: 'John Smith',
        text:
          'I’ve worked with Neville. He is super professional and creative, we are lucky to have you here!',
        approvePercent: 32,
        ownerAvatar:
          'https://live.envalab.com/html/cetus/demo/images/element/team/3.jpg',
        // createTime: firestore.FieldValue.serverTimestamp(),
        // createTime: '152117989365',
      },
    ],
  };

  const ImageGalleryFooter = ({imageIndex}) => {
    return (
      <View style={styles.imageGalleryTextContainer}>
        <Text style={styles.imageGalleryText}>
          {mockData.images[imageIndex].title}
        </Text>
      </View>
    );
  };

  const [imageGalleryIndex, setImageGalleryIndex] = useState(-1);
  const [topMessage, setTopMessage] = useState([]);

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

  const openBoostedInfo = () => {
    boostedInfoRef.current.snapTo(1);
    boostedInfoRef.current.snapTo(1);
  };

  const _handleTextReady = () => {
    // ...
  };

  useEffect(() => {
    const commonId = '48NPcGnpskN9YkqVNXKA';
    const proposalId = 'DmZFnbSbkwcQHMAyGa54';
    const discussionId = '43Q9abICrp2KpE86c1Az';
    firestore()
      .collection('common')
      .doc(commonId)
      .collection('proposal')
      .doc(proposalId)
      .collection('discussion')
      .doc(discussionId)
      .collection('message')
      .orderBy('createTime', 'desc')
      .limit(4)
      .get()
      .then(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('AAA', list);
        setTopMessage(list);
      });
  }, []);

  // useEffect(() => {});

  return (
    <>
      <View style={styles.container}>
        <View style={styles.proposalCard}>
          <View style={styles.proposalCardHeader}>
            <Icon name={'boosted'} color={colors.orange} size={16} />
            <Text style={{...text.orangeSmallBold, ...{marginHorizontal: 5}}}>
              Boosted
            </Text>
            <TouchableOpacity onPress={openBoostedInfo}>
              <Icon name={'explanation'} size={12} />
            </TouchableOpacity>
          </View>
          <View style={layout.content}>
            <View style={styles.proposalRowSubtitle}>
              <Text style={text.smallBoldGreyText}>143 votes</Text>
              <Text style={text.smallGreyText}>&nbsp;Created 3d ago</Text>
            </View>

            <View style={styles.proposalProgressInfo}>
              <View
                style={{...layout.content, ...layout.flexRow, ...{padding: 0}}}>
                <Icon
                  name="approved"
                  color={colors.lightishGreen}
                  size={14}
                  style={layout.marginRightXS}
                />
                <Text style={text.lightishGreenText}>73</Text>
              </View>

              <View
                style={{...layout.content, ...layout.flexRow, ...{padding: 0}}}>
                <Icon
                  name="declined"
                  color={colors.against}
                  size={14}
                  style={layout.marginRightXS}
                />
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
                agency MZ Studio and I propose to create a FB campaign to
                attract more members. This is divided into 3 steps: 1. Page
                Creation… 2. Advertising 3. Administration and Management I can
                undertake all the work required and have it up and running
                within a week.
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
              <Icon name="link" color={colors.mainBlue} size={16} />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Browser', {
                    url: 'https://daostack.io/',
                  })
                }>
                <Text style={styles.adsText}>Amazon Facebook group</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.adRow}>
              <Icon name="file" color={colors.mainBlue} size={16} />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PDFViwer', {
                    uri:
                      'http://samples.leanpub.com/thereactnativebook-sample.pdf',
                  })
                }>
                <Text style={styles.adsText}>
                  Facebook campaign segment.pdf
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 20}}>
          <View style={styles.imageGallery}>
            <View style={{width: 20}} />
            {mockData.images.map((currImage, currIndex) => {
              console.log('Image -> ', currImage);

              const currWidth = (currImage.width / currImage.height) * 220;

              return (
                <View style={{width: currWidth + 10}}>
                  <TouchableOpacity
                    onPress={() => setImageGalleryIndex(currIndex)}>
                    <Image
                      key={currIndex}
                      style={{
                        ...styles.galleryImage,
                        ...{width: currWidth},
                      }}
                      resizeMode="cover"
                      source={{uri: currImage.uri}}
                    />
                  </TouchableOpacity>
                  <ReadMore
                    numberOfLines={1}
                    renderTruncatedFooter={() => <View />}
                    renderRevealedFooter={() => <View />}>
                    <Text
                      style={{
                        ...text.textFieldplaceholder,
                        ...layout.marginTopS,
                      }}>
                      {currImage.title}
                    </Text>
                  </ReadMore>
                </View>
              );
            })}
            <View style={{width: 20}} />
          </View>
        </ScrollView>

        <View style={styles.proposalCard}>
          <View style={layout.content}>
            <View style={{...styles.proposalColumnSubtitle}}>
              <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
                Recent comments
              </Text>
            </View>
            {topMessage.length === 0 ? null : (
              <View style={{...layout.content, ...layout.flexStart}}>
                {topMessage.map((currMessage, currIndex) => {
                  return (
                    <UserMessageCard
                      photoURL={currMessage.ownerAvatar}
                      name={currMessage.ownerName}
                      message={currMessage.text}
                      time={currMessage.createTime}
                    />
                    // <DiscussionMessage data={currMessage} />
                  );
                })}
              </View>
            )}
            {/* <ChatRoom path="common/48NPcGnpskN9YkqVNXKA/proposal/DmZFnbSbkwcQHMAyGa54/discussion/43Q9abICrp2KpE86c1Az/message"/> */}
            <View style={layout.contant}>
              <TouchableOpacity onPress={() => props.showMore()}>
                <Text style={styles.messageShowMoreBtn}>Show more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ImageView
        images={mockData.images}
        imageIndex={imageGalleryIndex}
        visible={imageGalleryIndex > -1}
        onRequestClose={() => setImageGalleryIndex(-1)}
        FooterComponent={ImageGalleryFooter}
      />
    </>
  );
};

const styles = StyleSheet.create({
  imageGalleryTextContainer: {
    ...layout.content,
    ...layout.flexStart,
    ...layout.marginBottomM,
  },

  imageGalleryText: {
    ...text.blackText,
    fontSize: 16,

    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },

  imageGallery: {
    ...layout.flexRow,
    ...layout.flexStart,

    width: '100%',
  },

  galleryImage: {
    marginRight: 15,
    width: 120,
    height: 250,
    borderRadius: 10,
  },

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
    padding: 0,
    paddingTop: 20,
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
    marginHorizontal: 20,
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
    alignItems: 'center',
    ...layout.flexRow,
    padding: 0,
    alignSelf: 'stretch',
    paddingVertical: sizeM,
  },

  messageShowMoreBtn: {
    ...text.h3Black,
    color: colors.mainBlue,
  },
});

export default ProposalData;
