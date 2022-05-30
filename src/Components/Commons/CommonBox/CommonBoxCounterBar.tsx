import {observer} from 'mobx-react';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font} from '~/Theme';

export const CommonBoxCounterBar = observer((props) => {
  const {common} = props;

  const proposalsCount = common.proposalCount;
  const discussionsCount = common.discussionCount;
  const messageCount = common.messageCount;

  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarItem}>
        <Icon name={'proposal'} size={25} />
        <Text style={styles.bottomBarText}>{proposalsCount}</Text>
      </View>
      <View style={styles.bottomBarItem}>
        <Icon name={'discussion'} size={25} />
        <Text style={styles.bottomBarText}>{discussionsCount}</Text>
      </View>
      <View style={styles.bottomBarItem}>
        <Image
          style={styles.messageImage}
          source={require('~/Assets/message.png')}
        />
        <Text style={styles.bottomBarText}>{messageCount}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  bottomBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
    height: 48,
    paddingHorizontal: 10,
  },
  bottomBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarText: {
    ...font.primary.bold,
    color: colors.greySubtitle,
    marginLeft: 15,
    fontSize: 16,
  },
  messageImage: {
    height: 16,
    width: 16,
  },
});
