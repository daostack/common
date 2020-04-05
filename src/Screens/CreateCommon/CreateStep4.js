import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import TextInputField from '../../Components/FormFields/TextInputField';
import {colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
import Icon from '../../Assets/iconfont/Icon';
const {width} = Dimensions.get('window');

const CreateStep4 = (props) => {
  const [common, setCommon] = useState(false);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      width={width - 48}
      contentContainerStyle={{
        // alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flex: 1,
          // alignItems: 'center',
          // padding: 24,
          backgroundColor: 'white',
        }}>
        <Text
          style={{
            marginTop: 24,
            fontWeight: '700',
            fontSize: 18,
            textAlign: 'center',
          }}>
          Final touches and review
        </Text>
        <Text
          style={{
            marginTop: 12,
            marginBottom: 23,
            textAlign: 'center',
            marginHorizontal: 20,
          }}>
          You will not be able to make changes to the common info after it is
          published
        </Text>
        <View style={styles.image}>
          {/* <Image source={require('../../Assets/funds.png')} resizeMode='cover' /> */}
          {/* <Text>Placeholder</Text> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
            marginVertical: 15,
          }}>
          <Text style={{flex: 1, alignSelf: 'flex-start'}}>
            Have an avatar for you Common?
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                alignSelf: 'flex-end',
                flex: 1,
                color: colors.mainBlue,
                fontSize: 16,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>
              Upload avatar
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{height: 1, width: width, backgroundColor: colors.grey4}}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 40,
            marginBottom: 30,
            flex: 1,
          }}>
          <View style={{width: 90, marginRight: 10}}>
            <Text
              style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
              $10K
            </Text>
            <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
              Goal
            </Text>
          </View>
          <View style={{width: 90, marginHorizontal: 10}}>
            <Text
              style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
              $10
            </Text>
            <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
              Contribution
            </Text>
          </View>
          <TouchableOpacity
            style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
            <Icon
              name="edit"
              size={16}
              style={{textAlign: 'right', alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 40,
            marginBottom: 20,
            flex: 1,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>About</Text>
          <TouchableOpacity
            style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
            <Icon
              name="edit"
              size={16}
              style={{textAlign: 'right', alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>
        </View>
        <Text style={{fontSize: 14, marginTop: 0}}>
          We aim to ba a global non-profit initiative. Only small percentage of
          creative directors are women and we want to help change this through
          mentorship circles, portfolio reviews, talks & creative meetups.
        </Text>
        <>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 40,
              marginBottom: 20,
              flex: 1,
            }}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>
              Course of action
            </Text>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 14, marginTop: 0}}>
            We created this community to help you along your journey. Links to
            sponsored content or brands will vote you out.
          </Text>
        </>
        <>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 40,
              marginBottom: 10,
              flex: 1,
            }}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Link</Text>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 14, marginTop: 0}}>
            https://www.google.com/
          </Text>
        </>
        <>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 40,
              marginBottom: 10,
              flex: 1,
            }}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Deadline</Text>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 14, marginTop: 0}}>03 April 2021</Text>
        </>
        <>
          <Text style={{fontSize: 14, marginTop: 20, color: colors.grey3}}>
            Rule #1
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              marginBottom: 20,
              flex: 1,
            }}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>
              No promotions or spam
            </Text>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 14, marginTop: 0}}>
            We created this community to help you along your journey. Links to
            sponsored content or brands will vote you out.
          </Text>
        </>
        <>
          <Text style={{fontSize: 14, marginTop: 20, color: colors.grey3}}>
            Rule #2
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              marginBottom: 20,
              flex: 1,
            }}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>
              Be courteous and kind to others
            </Text>
            <TouchableOpacity
              style={{flex: 1, top: 0, right: 0, position: 'relative'}}>
              <Icon
                name="edit"
                size={16}
                style={{textAlign: 'right', alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 14, marginTop: 0}}>
            We're all in this together to create a nurturing enviroment. Let's
            teat everyone with resprct. Healthy debates are natural, but
            kindness is required.
          </Text>
        </>
      </View>
    </ScrollView>
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
  image: {
    // width: width,
    height: 223,
    backgroundColor: '#efefef',
    alignSelf: 'stretch',
    zIndex: 999,
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

export default CreateStep4;
