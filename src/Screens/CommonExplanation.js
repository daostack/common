import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');


const CreateCommon = ({navigation}) => {
  const [common, setCommon] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'white',
      }}>
      <View style={{backgroundColor: '#f1f1f1', width, height: 149}} />
      <Text
        style={{
          marginTop: 24,
          fontWeight: '700',
          fontSize: 18,
          textAlign: 'center',
        }}>
        Organize a community to work together for a cause you care about
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: 36,
          paddingHorizontal: 24,
        }}>
        <View>
          <Image
            source={require('../Assets/funding.png')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              marginRight: 8,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
            }}>
            Raise the funds you need
          </Text>
          <Text style={{marginTop: 12, marginBottom: 23}}>
            Set the amount of money you want to raise to reach your goal and how
            much each member should donate.
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: 28,
          paddingHorizontal: 24,
        }}>
        <View>
          <Image
            source={require('../Assets/members24.png')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              marginRight: 8,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
            }}>
            Harness the power of the crowd
          </Text>
          <Text style={{marginTop: 12, marginBottom: 23}}>
            All members of the common has equal weight in the decision making
            process. From what action you should take, through how to spend the
            money and even who should be a member.
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: 28,
          paddingHorizontal: 24,
        }}>
        <View>
          <Image
            source={require('../Assets/blockchain1.png')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              marginRight: 8,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 18,
            }}>
            Keep things completely decentralised
          </Text>
          <Text style={{marginTop: 12, marginBottom: 23}}>
            Everything is automated and protected by blockchain technology to
            assure decisions match the common consensus.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateCommon')}
        style={styles.continueButton}>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontWeight: '700',
          }}>
          Get started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  oval: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval2: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.grey4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readMoreButton: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.mainBlue,
  },
  continueButton: {
    width: '100%',
    height: 48,
    borderRadius: 32,
    marginTop: 25,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
});

export default inject('completeAccountFormStore')(observer(CreateCommon));
