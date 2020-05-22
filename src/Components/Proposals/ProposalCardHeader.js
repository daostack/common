import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {text, layout, colors, sizeXS} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const ProposalCardHeader = ({isBoosted, openBoostedInfo}) => {
  let iconName = 'star';
  let iconColor = colors.mainBlue;
  let headerTitle = 'Boosted';

  if (isBoosted) {
    iconName = 'boosted';
    iconColor = colors.orange;
    headerTitle = 'Boosted';
  }

  return (
    <View style={styles.proposalCardHeader}>
      <Icon name={iconName} color={iconColor} size={16} />
      <Text style={{...text.orangeSmallBold, ...{marginHorizontal: 5}}}>
        {headerTitle}
      </Text>
      {openBoostedInfo ? (
        <TouchableOpacity onPress={openBoostedInfo}>
          <Icon name={'explanation'} size={12} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  proposalCardHeader: {
    ...layout.content,
    ...layout.flexRow,
    alignSelf: 'stretch',
    backgroundColor: colors.orangeLight,
    padding: sizeXS,
  },
});

export default ProposalCardHeader;
