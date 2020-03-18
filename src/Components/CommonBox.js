import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
const {height, width} = Dimensions.get('window');

const CommonBox = (props) => {
  return (
    <TouchableOpacity key={props.i} onPress={{}} style={styles.commonBox}>
      <View
        style={{
          width: '100%',
          padding: 30,
          paddingTop: 50,
          paddingBottom: 50,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: 'black',
        }}>
        <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
          {props.common.name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 17,
          }}>
          <Text
            style={{
              color: 'grey',
              fontSize: 10,
              marginBottom: 15,
              fontWeight: '700',
            }}>
            Reputation Holders
          </Text>
          <Text style={{fontSize: 25, fontWeight: '700'}}>
            {props.common.reputationHoldersCount}
          </Text>
        </View>
        <View
          style={{
            height: 50,
            width: 1,
            backgroundColor: '#c9c9c9',
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 17,
          }}>
          <Text
            style={{
              color: 'grey',
              fontSize: 10,
              marginBottom: 15,
              fontWeight: '700',
            }}>
            Open Proposals
          </Text>
          <Text style={{fontSize: 25, fontWeight: '700'}}>
            {
              props.common.proposals.filter(
                proposal =>
                  proposal.stage !== 'Executed' &&
                  proposal.stage !== 'ExpiredInQueue',
              ).length
            }
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  commonBox: {
    width: width - 36,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.09)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 13,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eeeeee',
    marginBottom: 10,
  },
});

export default CommonBox
