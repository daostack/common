import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
const {width} = Dimensions.get('window');

const CommonBox = props => {
  return (
    <TouchableOpacity
      key={props.key}
      onPress={() => props.navigation.navigate('CommonProfile')}
      style={styles.commonBox}>
      <ImageBackground
        source={{
          uri: props.image,
        }}
        imageStyle={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        style={{
          padding: 30,
          paddingTop: 50,
          paddingBottom: 50,
          backgroundColor: 'black',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity style={{position: 'absolute', top: 12, left: 12}}>
          <Image
            style={styles.followImage}
            source={require('../Assets/follow.png')}
          />
        </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontSize: 23, fontWeight: '700'}}>
            {props.common.name}
          </Text>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
            Common Description
          </Text>
        </View>
      </ImageBackground>
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
          <Text style={styles.descriptionNumber}>
            {
              props.common.proposals.filter(
                proposal =>
                  proposal.stage !== 'Executed' &&
                  proposal.stage !== 'ExpiredInQueue',
              ).length
            }
          </Text>
          <Text style={styles.descriptionTitle}>Proposals</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 17,
          }}>
          <Text style={styles.descriptionNumber}>
            {props.common.reputationHoldersCount}
          </Text>
          <Text style={styles.descriptionTitle}>Reputation Holders</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            margin: 17,
          }}>
          <Text style={styles.descriptionNumber}>
            ${props.common.reputationHoldersCount * 1.5}
          </Text>
          <Text style={styles.descriptionTitle}>Funding</Text>
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
  followImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  descriptionNumber: {
    marginBottom: 4,
    fontFamily: 'HelveticaNeue',
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  descriptionTitle: {
    fontFamily: 'HelveticaNeue',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
});

export default CommonBox;
