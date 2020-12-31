import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  StyleSheet,
  Modal,
} from 'react-native';
import {object, bool, number, func, string, shape, InferProps} from 'prop-types';
import {colors, layout} from '~/Theme';
import CreateStepHeader from './CreateStepHeader';
import NavigationBar from 'react-native-navbar';
import Icon from '~/Assets/iconfont/Icon';
import CreateStepDotHeader from '../../../Components/Layouts/CreateStepDotHeader';
import RequestStepActionButton from '../RequestStepActionButton';
// import UseAcknowledgment from '../../../Components/Proposals/UseAcknowledgment';
const {width} = Dimensions.get('window');

const props = {
  closeDialog: func,
  navigation: object,
  stepDotHeaderTitle: string,
  navTitle: string,
  currentIndex: number,
  renderBody: func,
};

const StepDotLayout: React.FC<InferProps<typeof props>> = ({
  closeDialog,
  navigation,
  stepDotHeaderTitle,
  navTitle,
  currentIndex,
  renderBody,
}) => {

  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    const height = scrollY.interpolate({
      inputRange: [125, 185],
      outputRange: [0, 56],
      extrapolate: 'clamp',
    });

    // const height = scrollY.value > 100 ? 125 : 0;
    setHeaderHeight(height);
  }, [scrollY]);

  return (
    <>
      {/* TODO: add userAcnowledge
        <Modal animationType="slide" transparent={true} visible={useAcknowledgmentVisible}>
        <UseAcknowledgment onPressAgree={push} />
        </Modal> */}
      <SafeAreaView style={layout.backgroundWhite} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <NavigationBar
          statusBar={{hidden: true}}
          style={{borderBottomWidth: 1, borderBottomColor: colors.grey4}}
          title={{
            title: navTitle,
          }}
          rightButton={
            <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={() => {
                closeDialog();
              }}>
              <Icon
                name="close"
                size={18}
                style={{marginRight: 20}}
                color="black"
              />
            </TouchableOpacity>
          }
        />
        <CreateStepDotHeader
          title={stepDotHeaderTitle}
          currentIndex={currentIndex}
          navigation={navigation}
          headerHeight={headerHeight}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          width={width}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: scrollY}}},
          ],
          {useNativeDriver: false})}>
          <CreateStepHeader currentIndex={0} />
          {renderBody()}
        </ScrollView>
        {/* TODO: add parameter for rendering requeust step button
        <RequestStepActionButton
        title="Continue to Funding"
        formStore={generalInfoFormStore}
        onPress={() => {
          if (generalInfoFormStore.isFormValid()) {
            setUseAcknowledgmentVisible(true);
          }
        }}
      /> */}
      </SafeAreaView>
      {/* Blur View from createStep 1 */}
    </>
  );
};


StepDotLayout.propTypes = props;

const styles = StyleSheet.create({
  blurView: {position: 'absolute', ...StyleSheet.absoluteFill},
});

export default StepDotLayout;
