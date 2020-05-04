import React from 'react';
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

const ProposalData = ({}) => {
  const mockData = {
    images: [
      {
        id: '0',
        author: 'Alejandro Escamilla',
        width: 5616,
        height: 3744,
        url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
        download_url: 'https://picsum.photos/id/0/5616/3744',
      },
      {
        id: '10',
        author: 'Paul Jarvis',
        width: 4200,
        height: 1667,
        url: 'https://unsplash.com/photos/6J--NXulQCs',
        download_url: 'https://picsum.photos/id/10/2500/1667',
      },
      {
        id: '1',
        author: 'Alejandro Escamilla',
        width: 5616,
        height: 3744,
        url: 'https://unsplash.com/photos/LNRyGwIJr5c',
        download_url: 'https://picsum.photos/id/1/5616/3744',
      },
      {
        id: '100',
        author: 'Tina Rataj',
        width: 2500,
        height: 1656,
        url: 'https://unsplash.com/photos/pwaaqfoMibI',
        download_url: 'https://picsum.photos/id/100/2500/1656',
      },
    ],

    discussions: [
      {
        name: 'John Smith',
        message: 'How can I help?',
        imageUrl:
          'https://live.envalab.com/html/cetus/demo/images/element/team/1.jpg',
        time: '22:36',
      },
      {
        name: 'John Smith',
        message: 'Why now?',
        imageUrl:
          'https://live.envalab.com/html/cetus/demo/images/element/team/2.jpg',
        time: '22:36',
      },
      {
        name: 'John Smith',
        message:
          'I’ve worked with Neville. He is super professional and creative, we are lucky to have you here!',
        approvePercent: 32,
        imageUrl:
          'https://live.envalab.com/html/cetus/demo/images/element/team/3.jpg',
        time: '22:36',
      },
    ],
  };

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
              <Text style={styles.adsText}>Amazon Facebook group</Text>
            </View>

            <View style={styles.adRow}>
              <Icon name="file" color={colors.mainBlue} size={16} />
              <Text style={styles.adsText}>Facebook campaign segment.pdf</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal={true}>
          <View style={styles.imageGallery}>
            {mockData.images.map((currImage, currIndex) => {
              console.log('Image -> ', currImage);
              return (
                <View>
                  <Image
                    key={currIndex}
                    style={{
                      ...styles.galleryImage,
                      ...{width: (currImage.width / currImage.height) * 100},
                    }}
                    resizeMode="cover"
                    source={{uri: currImage.download_url}}
                  />
                  <Text
                    style={{
                      ...text.textFieldplaceholder,
                      ...layout.marginTopS,
                    }}>
                    {currImage.author}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.proposalCard}>
          <View style={layout.content}>
            <View style={{...styles.proposalColumnSubtitle}}>
              <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
                Recent comments
              </Text>
            </View>
            <View style={{...layout.content, ...layout.flexStart}}>
              {mockData.discussions.map((currMessage, currIndex) => {
                return (
                  <UserMessageCard
                    photoURL={currMessage.imageUrl}
                    name={currMessage.name}
                    message={currMessage.message}
                    time={currMessage.time}
                  />
                );
              })}
            </View>
            <View style={layout.contant}>
              <TouchableOpacity>
                <Text style={styles.messageShowMoreBtn}>Show more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageGallery: {
    ...layout.flexRow,
    ...layout.flexStart,

    height: 300,
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
