import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Icon from '../Assets/iconfont/Icon';
import {colors, font, text} from '../Theme';
import {inject, observer} from 'mobx-react';
import {BOTTOM_SHEET_TEMPLATES} from '../Stores/BottomSheetStore';

const ContributionListItem = ({commonName, dueDate, active, amount, proposalId, bottomSheetStore}) => {

  const onCancelConfirm = async () => {
    try {
      console.log(`@todo Cancel monthly subscription for proposal ${proposalId}`);

      await new Promise((x) => setTimeout(x, 3000));

      return true;
    } catch (e) {
      return false;
    }
  };

  const onCancelClick = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.CANCEL_SUBSCRIPTION, {
      onCancelConfirm,
      commonName,
      dueDate,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          {commonName}
        </Text>

        <Text style={styles.dueText}>
            Next payment: {dueDate.toDateString()}
        </Text>

        <Text style={styles[active ? 'active' : 'inactives']}>
          {active ? 'Active' : 'Inactive'}
        </Text>
      </View>

      <TouchableOpacity style={styles.rightContainer} onPress={onCancelClick}>
        <Icon
          name="delete"
          size={16}
          style={styles.icon}
        />

        <Text>${amount}/mo</Text>
      </TouchableOpacity>
    </View>
  );
};

ContributionListItem.propTypes = {
  commonName: PropTypes.string.isRequired,
  dueDate: PropTypes.instanceOf(Date).isRequired,
  amount: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  proposalId: PropTypes.string,

  bottomSheetStore: PropTypes.shape({
    showBottomSheet: PropTypes.func,
  }),
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },

  rightContainer: {
    alignItems: 'flex-end',
  },

  title: {
    ...text.bold,
    ...font.fontSize(2),
  },

  dueText: {
    ...font.fontSize(1),
    marginVertical: 10,
  },

  icon: {
    marginBottom: 10,
  },

  active: {
    color: colors.lightishGreen,
  },

  inactive: {
    color: colors.error,
  },
});

export default inject('bottomSheetStore')(observer(ContributionListItem));

