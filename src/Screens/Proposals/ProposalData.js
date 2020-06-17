import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {text, layout, colors, sizeM} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import ReadMore from 'react-native-read-more-text';
import UserMessageCard from '../../Components/Discussion/UserMessageCard';
import ImageView from 'react-native-image-viewing';
import Loader from '../../Components/Loader';
import ImageSize from 'react-native-image-size';
import ProposalCardHeader from '../../Components/Proposals/ProposalCardHeader';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {BOTTOM_SHEET_TEMPLATES} from '../../Stores/BottomSheetStore';
import {observer, inject} from 'mobx-react';
import moment from 'moment';
import {PROPOSAL_TYPE} from '../../Config';

const ProposalData = props => {
  const navigation = useNavigation();
  const [proposalInfo, setProposalInfo] = useState(null);

  const proposalId = props.proposalId;

  useEffect(() => {
    // noinspection JSAnnotator
    const loadProposalInfo = async currProposalInfo => {
      // noinspection JSAnnotator
      try {
        if (currProposalInfo) {
          let tempImages = [];
          if (currProposalInfo.description.images) {
            await Promise.all(
              currProposalInfo.description.images.map(async currImage => {
                const {width, height} = await ImageSize.getSize(currImage.uri);
                tempImages.push({
                  title: currImage.title,
                  widthRatio: (width / height) * 220,
                  uri: currImage.uri,
                });
              }),
            );
          }
          setProposalInfo({...currProposalInfo, ...{images: tempImages}});
        }

      } catch (error) {
        console.log('error: ', error);
      }
    };

    const loadDiscussions = () => {
      firestore()
        .collection('discussionMessage')
        .where('discussionId', '==', proposalId)
        .orderBy('createTime', 'desc')
        .limit(4)
        .get()
        .then(snapshot => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTopMessage(list);
        });
    };

    loadProposalInfo(props.proposalInfo);
    loadDiscussions();
  }, [props.proposalInfo]);

  const ImageGalleryFooter = ({imageIndex}) => {
    return (
      <View style={styles.imageGalleryTextContainer}>
        <Text style={styles.imageGalleryText}>
          {proposalInfo.images[imageIndex].title}
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
    props.bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.BOOSTED_INFO);
  };

  const _handleTextReady = () => {
    // ...
  };

  let progressBarWidthPercent = 0;

  if (proposalInfo) {
    progressBarWidthPercent =
      (proposalInfo.votesFor /
        (proposalInfo.votesFor + proposalInfo.votesAgainst)) *
      100;
  }

  const isBoosted = props.stage === 'Boosted';

  return proposalInfo ? (
    <>
      <View style={styles.container}>
        <View style={styles.proposalCard}>
          <ProposalCardHeader
            isBoosted={isBoosted}
            openBoostedInfo={openBoostedInfo}
          />
          <View style={layout.content}>
            <View style={styles.proposalRowSubtitle}>
              <Text style={text.smallBoldGreyText}>
                {proposalInfo.votesFor + proposalInfo.votesAgainst} votes
              </Text>
              <Text style={text.smallGreyText}>
                &nbsp;Created {moment.unix(proposalInfo.createdAt).fromNow()}
              </Text>
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
                <Text style={text.lightishGreenText}>
                  {proposalInfo.votesFor}
                </Text>
              </View>

              <View
                style={{...layout.content, ...layout.flexRow, ...{padding: 0}}}>
                <Icon
                  name="declined"
                  color={colors.against}
                  size={14}
                  style={layout.marginRightXS}
                />
                <Text style={text.againstText}>
                  {proposalInfo.votesAgainst}
                </Text>
              </View>
            </View>
            <View style={styles.proposalProgressBar}>
              <View
                style={{
                  ...styles.proposalInnerProgressBar,
                  ...{
                    width: `${progressBarWidthPercent}%`,
                  },
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.proposalCard}>
          <View style={layout.content}>
            <View style={styles.proposalColumnSubtitle}>
              <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
                Cost
              </Text>
              <Text style={text.h1Black}>{`$${
                proposalInfo.type === PROPOSAL_TYPE.FundingRequest
                  ? proposalInfo.fundingRequest.amount / 100
                  : proposalInfo.joinAndQuit.funding / 100
              }`}</Text>
            </View>

            <ReadMore
              numberOfLines={5}
              renderTruncatedFooter={_renderTruncatedFooter}
              renderRevealedFooter={_renderRevealedFooter}
              onReady={_handleTextReady}>
              <Text style={text.blackText}>{proposalInfo.description.description}</Text>
            </ReadMore>
          </View>
        </View>

        <View style={styles.proposalCard}>
          <View style={layout.content}>
            <View style={styles.proposalColumnSubtitle}>
              <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
                Links
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
                <Text style={styles.adsText}>TODO: show actual links here</Text>
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
                  TODO: show links to actually uploade files here
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
            {proposalInfo.images.map((currImage, currIndex) => {
              return (
                <View
                  style={{width: currImage.widthRatio + 10}}
                  key={`proposalImg_${currIndex}`}>
                  <TouchableOpacity
                    onPress={() => setImageGalleryIndex(currIndex)}>
                    <Image
                      key={currIndex}
                      style={{
                        ...styles.galleryImage,
                        ...{width: currImage.widthRatio},
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

        {topMessage.length === 0 ? null : (
          <View style={styles.proposalCard}>
            <View style={layout.content}>
              <View style={{...styles.proposalColumnSubtitle}}>
                <Text style={{...text.smallGreyText, ...layout.marginBottomS}}>
                  Recent comments
                </Text>
              </View>

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
              <View style={layout.contant}>
                <TouchableOpacity onPress={() => props.showMore()}>
                  <Text style={styles.messageShowMoreBtn}>Show more</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
      <ImageView
        images={proposalInfo.images}
        imageIndex={imageGalleryIndex}
        visible={imageGalleryIndex > -1}
        onRequestClose={() => setImageGalleryIndex(-1)}
        FooterComponent={ImageGalleryFooter}
      />
    </>
  ) : (
    <Loader />
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

export default inject('bottomSheetStore')(observer(ProposalData));
