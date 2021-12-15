import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {colors} from '~/Theme';
import {AddBankAccountForm} from '../Forms/AddBankAccountForm';
import {
  AddBankAccountTitle,
  AddBankAccountTitleError,
} from './AddBankAccountTitle';
import {styles} from './styles';

export function AddBankAccountField({hasError = false, isAddingNew}: {hasError: boolean}) {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };
  const removeAccount = () => {
    console.log('remove');
  };

  return (
    <View style={[styles.container, hasError ? styles.containerError : {}]}>
      {hasError ? <AddBankAccountTitleError /> : <AddBankAccountTitle />}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({pressed}) => [
          {
            opacity: pressed ? 0.5 : 1.0,
          },
          styles.button,
        ]}>
        <Text
          style={[
            styles.buttonTitle,
            {color: hasError ? colors.orange : colors.mainBlue},
          ]}>
          Add Bank Account
        </Text>
      </Pressable>
      <BottomSheetModal
        style={{borderRadius: 30}}
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}>
        <AddBankAccountForm
          onCancel={closeModal}
          onDelete={removeAccount}
          isAddingNew
        />
      </BottomSheetModal>
    </View>
  );
}
