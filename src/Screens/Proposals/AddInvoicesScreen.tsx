import {left} from 'ios/Pods/web3swift/Sources/web3swift/Browser/browser';
import {inject, observer} from 'mobx-react';
import {InferProps, number, object, shape, string} from 'prop-types';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import BottomSheetModal from '~/Components/BottomSheetModal';
import ProposalInfo from '~/Components/Proposals/ProposalInfo';
import {colors, font, layout, text} from '~/Theme';
import {rootStorePropTypes} from '~/Types/propTypes';
import ImagePicker from 'react-native-image-picker';
import StorageService from '~/Services/StorageService';
import DocumentPicker from 'react-native-document-picker';
import logger from '../../Services/Logger';
import {handlePermission} from '../../Util/Permissions';
import {InvoiceImage} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {CurrencySymbols} from '~/Util/locale';
import RequestStepActionButton from '../Commons/RequestStepActionButton';
import ModalFinishUploadInvoices from './components/ModalFinishUploadInvoices';
import ModalUploadInvoice from './components/ModalUploadInvoice';
import ModalAddInvoiceAmount from './components/ModalAddInvoiceAmount';
import ModalDeleteInvoice from './components/ModalDeleteInvoice';

const props = {
  route: shape({
    params: shape({
      proposalId: number,
    }).isRequired,
  }).isRequired,
  // Injected
  rootStore: rootStorePropTypes.isRequired,
};

const AddInvoicesScreen: React.FC<InferProps<typeof props>> = ({
  route: {
    params: {proposalId},
  },
  rootStore,
}) => {
  const proposalStore = rootStore.proposalStore;
  const commonStore = rootStore.commonStore;
  const userInfo = rootStore.authStore.userInfo;

  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);
  const [isFinishModalVisible, setIsFinishModalVisible] = useState(false);
  const [isAddAmountModalVisible, setIsAddAmountModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [invoiceImages, setInvoiceImages] = useState<InvoiceImage[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [invoiceSelected, setInvoiceSelected] = useState(0);

  const proposalInfo = proposalStore.getProposalById(proposalId);
  const commonInfo = commonStore.getCommonById(proposalInfo.commonId);

  console.log(proposalInfo);

  const closeSheet = () => {
    setIsBottomModalVisible(false);
  };

  const openSheet = () => {
    setIsBottomModalVisible(true);
  };

  const closeFinish = () => {
    setIsFinishModalVisible(false);
  };

  const openFinish = () => {
    setIsFinishModalVisible(true);
  };

  const closeAddAmount = () => {
    setIsAddAmountModalVisible(false);
  };

  const openAddAmount = () => {
    setIsAddAmountModalVisible(true);
  };

  const closeDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const openDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const uploadInvoices = () => {
    //CALL TO ENDPOINT CREATED BY YURY
  };

  const pickFile = async () => {
    try {
      setIsLoading(true);

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const url = await StorageService.uploadFile(res.uri, res.name);
      setInvoiceImages([...invoiceImages, {url, type: 'file', amount: 0}]);
      setIsLoading(false);

      closeSheet();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setIsLoading(false);
      } else {
        throw err;
      }
    }
  };

  const totalAmount = () => {
    let total = 0;
    for (const invoice of invoiceImages) {
      total = Number(total) + Number(invoice.amount);
    }

    return total;
  };

  const launchCamera = () => {
    ImagePicker.launchCamera({}, async (response) => {
      setIsLoading(true);
      if (response.didCancel) {
        logger.log('User cancelled image picker');
        setIsLoading(false);
      } else if (response.error) {
        // only for ios because android handles this
        Platform.OS === 'ios' && (await handlePermission());
        logger.log('ImagePicker Error: ', response.error);
        setIsLoading(false);
      } else {
        StorageService.uploadImage(response.uri)
          .then((url: string): void => {
            setInvoiceImages([
              ...invoiceImages,
              {url, type: 'image', amount: 0},
            ]);
            setIsLoading(false);
            closeSheet();
          })
          .catch((error: any) => {
            logger.log('ImagePicker Error: ', error.toString());
          });
      }
    });
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary({}, async (response) => {
      setIsLoading(true);
      if (response.didCancel) {
        logger.log('User cancelled image picker');
      } else if (response.error) {
        logger.log('ImagePicker Error: ', response.error);
      } else {
        logger.log('Uploading image');
        StorageService.uploadImage(response.uri)
          .then((url: string): void => {
            logger.log('Image Uploaded ', url);
            setInvoiceImages([
              ...invoiceImages,
              {url, type: 'image', amount: 0},
            ]);
            setIsLoading(false);
            closeSheet();
          })
          .catch((error: any) => {
            logger.log('ImagePicker Error: ', error.toString());
          });
      }
    });
  };

  return (
    <ScrollView style={{backgroundColor: colors.white, flex: 1}}>
      <Image
        source={require('~/Assets/newLogoMobile.png')}
        style={{
          width: '100%',
          marginTop: 80,
          marginBottom: 50,
          resizeMode: 'contain',
        }}
      />
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          ...text.h1BlackTitle,
        }}>
        {commonInfo.name}
      </Text>
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          marginVertical: 30,
          ...font.primary.semiBold,
          ...font.fontSize(3),
        }}>{`Hi ${userInfo?.firstName},\n Please add of your invoices related to this proposal`}</Text>
      <View style={{marginHorizontal: 20}}>
        <ProposalInfo proposalInfo={proposalInfo} />
      </View>
      {invoiceImages.map((invoice, index) =>
        invoice.type === 'image' ? (
          <View style={{margin: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log(invoice);
                  setAmount(invoice.amount);
                  setInvoiceSelected(index);
                  openAddAmount();
                }}>
                <Text
                  style={{
                    color: colors.mainBlue,
                    flex: 1,
                    marginBottom: 10,
                  }}>{`Amount: ${CurrencySymbols.SHEKEL} ${invoice.amount}`}</Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setInvoiceSelected(index);
                    openDelete();
                  }}>
                  <Icon name="delete" size={16} color={colors.black} />
                </TouchableOpacity>
              </View>
            </View>
            <Image
              source={{
                uri: invoice.url,
              }}
              style={{
                height: 120,
                borderRadius: 20,
              }}
            />
          </View>
        ) : (
          <View style={{margin: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log(invoice);
                  setAmount(invoice.amount);
                  setInvoiceSelected(index);
                  openAddAmount();
                }}>
                <Text
                  style={{
                    color: colors.mainBlue,
                    flex: 1,
                    marginBottom: 10,
                  }}>{`Amount: ${CurrencySymbols.SHEKEL} ${invoice.amount}`}</Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setInvoiceSelected(index);
                    openDelete();
                  }}>
                  <Icon name="delete" size={16} color={colors.black} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.backgroundPdf}>
              <Icon name="noimage" size={16} />
            </View>
          </View>
        ),
      )}
      <TouchableOpacity onPress={openSheet}>
        <View style={styles.imageFieldPlaceholderView}>
          <Image
            source={require('~/Assets/addInvoice.png')}
            style={{
              width: 60,
              height: 50,
              marginVertical: 30,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              fontSize: 13,
              marginBottom: 10,
            }}>
            Add invoice
          </Text>
        </View>
      </TouchableOpacity>
      {invoiceImages.length > 0 && (
        <View style={{margin: 20}}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              ...text.h1BlackTitle,
              marginBottom: 20,
            }}>{`Total Invoices Amount: ${
            CurrencySymbols.SHEKEL
          } ${totalAmount()}`}</Text>

          <TouchableOpacity
            style={{...layout.btnPrimary, ...layout.marginTopL}}
            onPress={openFinish}>
            <Text style={text.buttoncenterwhite}>
              Done with uploading all invoices
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <ModalAddInvoiceAmount
        isVisible={isAddAmountModalVisible}
        onPressClose={closeAddAmount}
        amount={amount}
        onConfirm={(amountValue: number) => {
          closeAddAmount();
          const invoiceImagesTemp = invoiceImages.slice();
          invoiceImagesTemp[invoiceSelected].amount = amountValue; //execute the manipulations
          setInvoiceImages(invoiceImagesTemp);
          setAmount(0);
        }}
      />
      <ModalDeleteInvoice
        isVisible={isDeleteModalVisible}
        onPressClose={closeDelete}
        onConfirm={() => {
          closeDelete();
          const invoiceImagesTemp = invoiceImages.slice();
          invoiceImagesTemp.splice(invoiceSelected, 1);
          setInvoiceImages(invoiceImagesTemp);
        }}
      />
      <ModalUploadInvoice
        isVisible={isBottomModalVisible}
        closeSheet={closeSheet}
        pickImage={pickImage}
        launchCamera={launchCamera}
        pickFile={pickFile}
        isLoading={isLoading}
      />
      <ModalFinishUploadInvoices
        isVisible={isFinishModalVisible}
        onPressClose={closeFinish}
        proposalAmount={proposalInfo?.fundingRequest?.amount}
        invoicesAmount={totalAmount()}
        description={description}
        setDescription={setDescription}
        openFinish={uploadInvoices}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageFieldPlaceholderView: {
    ...layout.content,
    backgroundColor: colors.iceBlue,
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  finishGridContainer: {
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.iceBlue,
    borderRadius: 20,
    marginBottom: 20,
    flex: 1,
  },
  backgroundPdf: {
    ...layout.content,
    backgroundColor: colors.grey4,
    borderRadius: 20,
    height: 120,
  },
});

AddInvoicesScreen.propTypes = props;

export default inject('rootStore')(observer(AddInvoicesScreen));
