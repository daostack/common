import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from '../../Assets/iconfont/Icon';
import {text, layout, colors} from '../../Theme';
import DiscussionMessage from './DiscussionMessage';

const {width} = Dimensions.get('window');

const Discussions = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 60}}>
        <View style={{backgroundColor: colors.white, flex: 1, padding: 20}}>
          <Text style={styles.title}>
            How about planring tree in india as well?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={styles.avatar}
              // source={require('../../Assets/daoGeneralInfo.png')}
            />
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <Text style={{fontWeight: 'bold'}}>Name</Text>
              <Text style={{color: colors.grey3}}>0.1% REP</Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={{color: colors.white}}>Quick reply</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={{fontSize: 16, lineHeight: 25, paddingVertical: 20}}>
              It is a component to solve the common problem of views that need
              to move out of the way of the virtual keyboard. It can
              automatically adjust either its height, position, or bottom
              padding based on the keyboard height. It is a component to solve
              the common problem of views that need to move out of the way of
              the virtual keyboard. It can automatically adjust either its
              height, position, or bottom padding based on the keyboard height.
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 8}}>
              <Icon name="edit" />
              <Text>23</Text>
            </View>
            <View style={{flexDirection: 'row', paddingHorizontal: 8}}>
              <Icon name="edit" />
              <Text>23</Text>
            </View>
            <View style={{flexDirection: 'row', paddingHorizontal: 8}}>
              <Icon name="edit" />
              <Text>23</Text>
            </View>
          </View>

          <View
            style={{
              height: 2,
              marginVertical: 20,
              backgroundColor: colors.grey4,
            }}
          />
        </View>
        <DiscussionMessage />
        <DiscussionMessage />
        <DiscussionMessage />
        <DiscussionMessage />
      </ScrollView>

      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{position: 'absolute', bottom: 0, flex: 1}}>
        <View
          style={{
            backgroundColor: colors.white,
            borderColor: colors.mainBlue,
            borderwidth: 1,
            height: 60,
            width: width,
            flexDirection: 'row',
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowRadius: 4,
            shadowOpacity: 1,
            alignItems: 'center',
            paddingHorizontal: 15,
          }}>
          <TextInput style={{flex: 1}} fontSize={20} />
          <TouchableOpacity>
            <Icon name="edit" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{height: 30, backgroundColor: colors.white}} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: colors.black,
  },
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: colors.grey4,
    borderRadius: 17.5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    backgroundColor: colors.mainBlue,
  },
});

export default Discussions;
