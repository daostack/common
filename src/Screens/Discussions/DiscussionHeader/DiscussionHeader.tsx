import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import {text} from '~/Theme';
import {NavigationParams} from '~/Types/navigation';
import {RootStore} from '~/Types/store';
import {styles} from './styles';
import {DiscussionHeaderImage} from './DiscussionHeaderImage';
import {DiscussionHeaderFiles} from './DiscussionHeaderFiles';
import {inject, observer} from 'mobx-react';

interface Props {
  rootStore: RootStore;
  discussionId: string;
  commonId: string;
  fromNotificationItem: boolean;
  handleImageGallery: (index: number) => void;
}

const Header = ({
  rootStore,
  discussionId,
  commonId,
  fromNotificationItem,
  handleImageGallery,
}: Props) => {
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  const redirectBack = !commonId && fromNotificationItem;
  const discussionStore = rootStore.discussionStore;
  const userStore = rootStore.userStore;
  const dataState = discussionStore.getDiscussionById(discussionId);
  const user = dataState?.ownerId
    ? userStore.getUserById(dataState?.ownerId)
    : null;

  const navigateBack = () =>
    fromNotificationItem && !redirectBack
      ? navigation.replace('CommonProfile', {commonId})
      : navigation.pop();

  return (
    <>
      <NavigationBar
        statusBar={{hidden: true}}
        style={{
          height: 48,
        }}
        title={{
          title: dataState?.title || '',
          style: {...text.h2Black, maxWidth: '70%'},
          ellipsizeMode: 'tail',
          numberOfLines: 1,
        }}
        leftButton={
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => navigateBack()}>
            <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
          </TouchableOpacity>
        }
      />
      <View
        style={{
          overflow: 'hidden',
          paddingBottom: 5,
          maxHeight: '50%',
        }}>
        <View style={styles.headerContainer}>
          {dataState?.isExpanded ? (
            <View
              style={{
                paddingTop: 20,
                paddingHorizontal: 20,
                shadowColor: 'rgba(0, 0, 0, 0.12)',
              }}>
              <ScrollView style={{maxHeight: '90%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image style={styles.avatar} source={{uri: user?.photoURL}} />
                  <View style={{flex: 1, paddingHorizontal: 10}}>
                    <Text style={styles.displayName}>{user?.displayName}</Text>
                    {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
                    <Text style={styles.date}>
                      {moment(dataState.createTime.toDate()).fromNow()}
                    </Text>
                  </View>
                </View>

                <View>
                  <Hyperlink
                    linkDefault={true}
                    linkStyle={styles.hyperLinkStyle}>
                    <Text style={styles.message}>{dataState.message}</Text>
                  </Hyperlink>
                </View>

                <DiscussionHeaderImage
                  images={dataState.images}
                  handleImageGallery={handleImageGallery}
                />
                <DiscussionHeaderFiles files={dataState.files} />
              </ScrollView>

              <TouchableOpacity
                style={{alignItems: 'center', paddingVertical: 10}}
                onPress={() => {
                  dataState.isExpanded = !dataState.isExpanded;
                }}>
                <Image
                  style={{height: 10, width: 60}}
                  source={require('../../../Assets/collapse.png')}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={{alignItems: 'center', paddingVertical: 10}}
                onPress={() => {
                  dataState!.isExpanded = !dataState?.isExpanded;
                }}>
                <Image
                  style={{height: 10, width: 60}}
                  source={require('../../../Assets/expand.png')}
                />
              </TouchableOpacity>
            </>
          )}
          {/* <View
            style={{
              height: 4,
              marginTop: 10,
              // paddingHorizontal: -20,
              marginHorizontal: -20,
              backgroundColor: colors.grey4,
            }}
          /> */}
        </View>
      </View>
    </>
  );
};

export const DiscussionHeader = inject('rootStore')(observer(Header));
