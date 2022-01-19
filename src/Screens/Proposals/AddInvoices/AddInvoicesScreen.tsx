import {useRoute} from '@react-navigation/native';
import {inject, observer} from 'mobx-react';
import React, {ReactElement, useState} from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import Icon from '~/Assets/iconfont/Icon';
import ProposalInfo from '~/Components/Proposals/ProposalInfo';
import {InvoiceImage} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import PaymentsService from '~/Services/PaymentsService';
import {colors, layout, text} from '~/Theme';
import {AddInvoicesRouteProps} from '~/Types/navigation';
import {RootStore} from '~/Types/store';
import {CurrencySymbols} from '~/Util/locale';
import logger from '../../../Services/Logger';
import {handlePermission} from '../../../Util/Permissions';
import ModalAddInvoiceAmount from '../components/ModalAddInvoiceAmount';
import ModalDeleteInvoice from '../components/ModalDeleteInvoice';
import {ModalFinishUploadInvoices} from '../components/ModalFinishUploadInvoices/ModalFinishUploadInvoices';
import {ModalUploadInvoice} from '../components/ModalUploadInvoice';
import {ModalImagePreview} from '../components/ModalImagePreview';
import {styles} from './styles';
import {FILE_TYPES} from '~/Util/constants/firebaseStorage';

type Props = {
  rootStore: RootStore;
};

const AddInvoicesScreen = ({rootStore}: Props): ReactElement => {
  const router = useRoute<AddInvoicesRouteProps>();

  const {proposalId} = router.params;

  const proposalStore = rootStore.proposalStore;
  const commonStore = rootStore.commonStore;
  const userInfo = rootStore.authStore.userInfo;

  const [isBottomModalVisible, setIsBottomModalVisible] = useState(false);
  const [isFinishModalVisible, setIsFinishModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isAddAmountModalVisible, setIsAddAmountModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadInvoiceStatus, setUploadInvoiceStatus] = useState({
    isLoading: false,
    isUploaded: false,
  });

  const [invoiceImages, setInvoiceImages] = useState<InvoiceImage[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [invoiceSelected, setInvoiceSelected] = useState(0);

  const proposalInfo = proposalStore.getProposalById(proposalId);
  let commonInfo = null;
  if (proposalInfo) {
    commonInfo = commonStore.getCommonById(proposalInfo.commonId);
  }

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

  const uploadInvoices = async (): Promise<void> => {
    try {
      setUploadInvoiceStatus({...uploadInvoiceStatus, isLoading: true});
      await PaymentsService.uploadInvoices(
        proposalId as string,
        invoiceImages,
        description,
      );
      setUploadInvoiceStatus({
        ...uploadInvoiceStatus,
        isLoading: false,
        isUploaded: true,
      });
    } catch (err) {
      setUploadInvoiceStatus({
        isLoading: false,
        isUploaded: false,
      });
      setIsFinishModalVisible(false);
      logger.log('uploadInvoices error ~>', err);
    }
  };

  const pickFile = async ({
    isRetake = false,
  }: Partial<GestureResponderEvent & {isRetake: boolean}>) => {
    try {
      setIsLoading(true);

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (isRetake) {
        const updatedInvoiceImages = [...invoiceImages];
        updatedInvoiceImages[invoiceSelected] = {
          url: res.uri,
          mimeType: res.uri as string,
          amount: 0,
        };
        setInvoiceImages(updatedInvoiceImages);
        setIsPreviewModalVisible(false);
      } else {
        setInvoiceImages([
          ...invoiceImages,
          {url: res.uri, mimeType: res.type, amount: 0, name: res.name},
        ]);
      }

      setIsLoading(false);

      closeSheet();
    } catch (err) {
      if (DocumentPicker.isCancel(err as {code: string})) {
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

  const launchCamera = ({
    isRetake = false,
  }: Partial<GestureResponderEvent & {isRetake: boolean}>) => {
    setIsLoading(true);
    ImagePicker.launchCamera({}, async (response) => {
      if (response.didCancel) {
        logger.log('User cancelled image picker');
        setIsLoading(false);
      } else if (response.error) {
        Platform.OS === 'ios' && (await handlePermission());
        logger.log('ImagePicker Error: ', response.error);
        setIsLoading(false);
      } else {
        if (isRetake) {
          const updatedInvoiceImages = [...invoiceImages];
          updatedInvoiceImages[invoiceSelected] = {
            url: response.uri,
            mimeType: response.type as string,
            amount: 0,
          };
          setInvoiceImages(updatedInvoiceImages);
          setIsPreviewModalVisible(false);
        } else {
          setInvoiceImages([
            ...invoiceImages,
            {url: response.uri, mimeType: response.type as string, amount: 0},
          ]);
        }
      }
      setIsLoading(false);
      closeSheet();
    });
  };

  const pickImage = () => {
    setIsLoading(true);
    ImagePicker.launchImageLibrary({}, async (response) => {
      if (response.didCancel) {
        logger.log('User cancelled image picker');
      } else if (response.error) {
        logger.log('ImagePicker Error: ', response.error);
      } else {
        logger.log('Uploading image');

        setInvoiceImages([
          ...invoiceImages,
          {url: response.uri, mimeType: response.type as string, amount: 0},
        ]);
      }
      setIsLoading(false);
      closeSheet();
    });
  };

  function ModalInvoiceOptions({
    isInImagePreview = false,
  }: {
    isInImagePreview?: boolean;
  }): ReactElement {
    return (
      <>
        <ModalAddInvoiceAmount
          isVisible={
            isAddAmountModalVisible &&
            (isInImagePreview || !isPreviewModalVisible)
          }
          onPressClose={closeAddAmount}
          amount={amount}
          onConfirm={(amountValue: number) => {
            closeAddAmount();
            if (isInImagePreview) {
              setIsPreviewModalVisible(false);
            }
            const invoiceImagesTemp = invoiceImages.slice();
            invoiceImagesTemp[invoiceSelected].amount = amountValue; //execute the manipulations
            setInvoiceImages(invoiceImagesTemp);
            setAmount(0);
          }}
        />
        <ModalDeleteInvoice
          isVisible={
            isDeleteModalVisible && (isInImagePreview || !isPreviewModalVisible)
          }
          onPressClose={closeDelete}
          onConfirm={() => {
            closeDelete();
            if (isInImagePreview) {
              setIsPreviewModalVisible(false);
            }
            const invoiceImagesTemp = invoiceImages.slice();
            invoiceImagesTemp.splice(invoiceSelected, 1);
            setInvoiceImages(invoiceImagesTemp);
          }}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image
          source={require('~/Assets/newLogoMobile.png')}
          style={styles.logo}
        />
        <Text style={styles.commonNameText}>{commonInfo?.name}</Text>
        <Text
          style={
            styles.userGreetingsText
          }>{`Hi ${userInfo?.firstName},\n Please add of your invoices related to this proposal`}</Text>
        <View style={layout.marginHorizontalL}>
          <ProposalInfo proposalInfo={proposalInfo} />
        </View>
        {invoiceImages.map((invoice, index) =>
          invoice.mimeType?.includes(FILE_TYPES.image) ? (
            <View style={layout.marginL}>
              <View style={styles.invoiceHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setAmount(invoice.amount);
                    setInvoiceSelected(index);
                    openAddAmount();
                  }}>
                  <Text
                    style={
                      styles.amountText
                    }>{`Amount: ${CurrencySymbols.SHEKEL} ${invoice.amount}`}</Text>
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
              <Pressable
                onPress={() => {
                  setIsPreviewModalVisible(true);
                  setInvoiceSelected(index);
                }}>
                <Image
                  source={{
                    uri: invoice.url,
                  }}
                  style={styles.invoicePreview}
                />
              </Pressable>
            </View>
          ) : (
            <View style={layout.marginL}>
              <View style={styles.invoiceHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setAmount(invoice.amount);
                    setInvoiceSelected(index);
                    openAddAmount();
                  }}>
                  <Text
                    style={
                      styles.amountText
                    }>{`Amount: ${CurrencySymbols.SHEKEL} ${invoice.amount}`}</Text>
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
              <Pressable
                onPress={() => {
                  setAmount(invoice.amount);
                  setInvoiceSelected(index);
                  openAddAmount();
                }}
                style={styles.backgroundPdf}>
                <Icon name="noimage" size={16} />
              </Pressable>
            </View>
          ),
        )}
        <TouchableOpacity onPress={openSheet}>
          <View style={styles.imageFieldPlaceholderView}>
            <Image
              source={require('~/Assets/addInvoice.png')}
              style={styles.addInvoiceIcon}
            />
            <Text style={styles.addInvoiceText}>Add invoice</Text>
          </View>
        </TouchableOpacity>
        {invoiceImages.length > 0 && (
          <View style={layout.marginL}>
            <Text style={styles.totalAmountText}>{`Total Invoices Amount: ${
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
        <ModalInvoiceOptions />
        <ModalImagePreview
          isVisible={isPreviewModalVisible}
          buttonText="Add invoice amount"
          onPress={() => setIsAddAmountModalVisible(true)}
          pickImage={() => {
            launchCamera({isRetake: true});
          }}
          onDelete={openDelete}
          imageUrl={invoiceImages[invoiceSelected]?.url as string}>
          <ModalInvoiceOptions isInImagePreview />
        </ModalImagePreview>
        <ModalUploadInvoice
          isVisible={isBottomModalVisible}
          closeSheet={closeSheet}
          pickImage={pickImage}
          launchCamera={launchCamera}
          pickFile={pickFile}
          isLoading={isLoading}
        />
        <ModalFinishUploadInvoices
          proposalId={proposalId}
          commonId={commonInfo!.id}
          isVisible={isFinishModalVisible}
          onPressClose={closeFinish}
          proposalAmount={proposalInfo?.fundingRequest?.amount}
          invoicesAmount={totalAmount()}
          description={description}
          setDescription={setDescription}
          uploadInvoices={uploadInvoices}
          uploadInvoiceStatus={uploadInvoiceStatus}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default inject('rootStore')(observer(AddInvoicesScreen));
