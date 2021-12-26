import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font} from '~/Theme';
import {func, object} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';
import Icon from '~/Assets/iconfont/Icon';
import Loader from '~/Components/Loader';

const ModalUploadInvoice = ({
  isVisible,
  closeSheet,
  pickImage,
  launchCamera,
  pickFile,
  isLoading,
}) => (
  <BottomSheetModal
    isVisible={isVisible}
    onClose={closeSheet}
    style={{borderRadius: 25}}>
    {isLoading ? (
      <View style={{alignItems: 'center', width: '100%'}}>
        <Loader color={colors.mainBlue} />
        <Text
          style={{
            ...font.primary.semiBold,
            ...font.fontSize(3),
            color: colors.mainBlue,
            marginBottom: 150,
          }}>
          Loading Invoice
        </Text>
      </View>
    ) : (
      <View style={{alignItems: 'flex-start', width: '100%'}}>
        <TouchableOpacity onPress={launchCamera}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 50,
              marginTop: 30,
              marginLeft: 10,
              alignItems: 'center',
            }}>
            <Icon name="camera" color={colors.black} size={16} />
            <Text
              style={{
                ...font.primary.semiBold,
                ...font.fontSize(3),
                marginLeft: 10,
              }}>
              Take a photo
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 50,
              marginLeft: 10,
              alignItems: 'center',
            }}>
            <Icon name="picture" color={colors.black} size={16} />
            <Text
              style={{
                ...font.primary.semiBold,
                ...font.fontSize(3),
                marginLeft: 10,
              }}>
              Browse Photo Gallery
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickFile}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 90,
              marginLeft: 10,
              alignItems: 'center',
            }}>
            <Icon name="file" color={colors.black} size={16} />
            <Text
              style={{
                ...font.primary.semiBold,
                ...font.fontSize(3),
                marginLeft: 10,
              }}>
              Upload file
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )}
  </BottomSheetModal>
);

ModalUploadInvoice.propTypes = {
  onPressClose: func,
  children: object,
};

const styles = StyleSheet.create({});

export default ModalUploadInvoice;
