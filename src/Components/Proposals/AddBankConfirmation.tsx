import React, {useState} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Toast from '~/Util/Toast';
import logger from '~/Services/Logger';
import StorageService from '~/Services/StorageService';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';

export function AddBankConfirmation() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [filename, setFilename] = useState<string>();

  function deleteFile(url: string): void {
    StorageService.deleteFromStorage(url);
    setImageUrl(undefined);
    setFilename(undefined);
  }

  async function pickFile(): Promise<void> {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      Toast.loading('Uploading...');
      const downloadUrl = await StorageService.uploadFile(
        res.uri,
        res.name,
        'private',
      );
      setImageUrl(downloadUrl);
      setFilename(StorageService.getFilename(downloadUrl));
      logger.log('downloadUrl', downloadUrl);
      Toast.done('Success');
    } catch (err) {
      if (DocumentPicker.isCancel(err as any)) {
      } else {
        throw err;
      }
    }
  }

  return (
    <Pressable onPress={pickFile} style={styles.container}>
      <Icon name="add-document" />
      {imageUrl ? (
        <View style={[styles.titleContainer, styles.fileNameContainer]}>
          <Text style={[styles.title, {textDecorationLine: 'underline'}]}>
            {filename}
          </Text>
          <Pressable
            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
            onPress={() => {
              deleteFile(imageUrl);
            }}>
            <Icon name="delete" color={colors.black} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={[styles.text, styles.title]}>
            Add bank account confirmation letter
          </Text>
          <Text style={[styles.text, styles.hint]}>
            The form can be found on the bank's website
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(244,246,255)',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 8,
  },
  fileNameContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 16,
  },
  text: {
    fontSize: 11,
  },
  title: {
    color: colors.black,
    marginBottom: 8,
  },
  hint: {
    color: 'rgb(86,102,245)',
  },
});
