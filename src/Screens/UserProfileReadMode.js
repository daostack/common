import React, {useState, useEffect, useRef} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';

import Icon from '../Assets/iconfont/Icon';
import FirebaseService from '../Services/FirebaseService';

import {layout, colors, text, sizeS} from '../Theme';
import AccordionBtn from '../Components/AccordionBtn';

const UserProfileReadMode = ({navigation}) => {
  const [users, setUsers] = useState(null);
  const [ setUserId] = useState(null);
  bottomSheetContainerRef = useRef();

  useEffect(() => {
    const getUsers = async () => {
      if (!users) {
        try {
          const appUsers = await FirebaseService.getInstance().getUsers();
          setUsers(appUsers);
        } catch (error) {
          console.log('error: ', error);
        }
      }
    };

    getUsers();
  }, [users]);

  const onUserSelected = selectedUserId => {
    setUserId(selectedUserId);
    bottomSheetContainerRef.current.snapTo(1);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}>
          <View style={layout.content}>
            <Icon name="commons-selected" size={60} />
            <Text style={text.h3Black}>USERS</Text>
          </View>

          <View style={layout.content}>
            {users?.map((user, i) => {
              return (
                <AccordionBtn
                  key={i}
                  navigation={navigation}
                  title={user.name}
                  subtitle={user.email}
                  onPress={() => onUserSelected(user.id)}
                />
              );
            })}
          </View>
        </ScrollView>
        {/**
        <BottomSheetContainer ref={bottomSheetContainerRef}>
          <UserProfileSheetScreen navigation={navigation} userId={userId} />
        </BottomSheetContainer>
        */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    marginBottom: 100,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },

  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'flex-start',
  },
});

export default UserProfileReadMode;
