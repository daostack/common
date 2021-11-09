import React, {ReactElement, ReactNode} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ViewStyle,
} from 'react-native';
import {POSITION_ARROW} from '~/Util/constants/positionArrow.enum';

import {font, colors, text, layout} from '~/Theme';

interface Props {
  showModal: boolean;
  closeModal: () => void;
  title: string;
  description: string;
  positionArrow?: string;
  arrowMarginRight?: number;
  arrowMarginLeft?: number;
  modalPosition?: ViewStyle;
  children?: ReactNode;
}

const ModalPreview = ({
  showModal,
  closeModal,
  title,
  description,
  positionArrow,
  arrowMarginLeft,
  arrowMarginRight,
  modalPosition,
  children,
}: Props) => {
  const ArrowTop = (): ReactElement => (
    <View
      style={{
        ...styles.arrow,
        ...styles.arrowTop,
        marginLeft:
          positionArrow === POSITION_ARROW.TOP_LEFT ? arrowMarginLeft : 0,
        marginRight:
          positionArrow === POSITION_ARROW.TOP_RIGHT ? arrowMarginRight : 0,
        alignSelf:
          positionArrow === POSITION_ARROW.TOP_LEFT
            ? 'flex-start'
            : positionArrow === POSITION_ARROW.TOP_CENTER
            ? 'center'
            : positionArrow === POSITION_ARROW.TOP_RIGHT
            ? 'flex-end'
            : 'auto',
      }}
    />
  );

  const ArrowBottom = (): ReactElement => (
    <View
      style={{
        ...styles.arrow,
        ...styles.arrowBottom,
        marginLeft:
          positionArrow === POSITION_ARROW.BOTTOM_LEFT ? arrowMarginLeft : 0,
        marginRight:
          positionArrow === POSITION_ARROW.BOTTOM_RIGHT ? arrowMarginRight : 0,
        alignSelf:
          positionArrow === POSITION_ARROW.BOTTOM_LEFT
            ? 'flex-start'
            : positionArrow === POSITION_ARROW.BOTTOM_CENTER
            ? 'center'
            : positionArrow === POSITION_ARROW.BOTTOM_RIGHT
            ? 'flex-end'
            : 'auto',
      }}
    />
  );

  return (
    <>
      {!showModal && children}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={closeModal}>
        <View style={styles.background}>
          <View style={{...styles.container, ...modalPosition}}>
            {(positionArrow === POSITION_ARROW.TOP_CENTER ||
              positionArrow === POSITION_ARROW.TOP_LEFT ||
              positionArrow === POSITION_ARROW.TOP_RIGHT) && <ArrowTop />}
            <View style={styles.modal}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              <TouchableOpacity style={styles.btn} onPress={closeModal}>
                <Text style={styles.btnText}>Got it</Text>
              </TouchableOpacity>
            </View>
            {(positionArrow === POSITION_ARROW.BOTTOM_CENTER ||
              positionArrow === POSITION_ARROW.BOTTOM_LEFT ||
              positionArrow === POSITION_ARROW.BOTTOM_RIGHT) && <ArrowBottom />}
          </View>
          {children}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 26, 54, 0.3)',
  },
  container: {
    position: 'absolute',
    width: '90%',
  },
  modal: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: colors.mainBlue,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    ...font.fontSize(5),
    ...font.heading.bold,
    color: colors.white,
    textAlign: 'center',
  },
  description: {
    ...text.greyText,
    ...font.fontSize(2),
    fontWeight: '600',
    color: colors.grey4,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 14,
  },
  btn: {
    ...layout.btnOutline,
    height: 50,
  },
  btnText: {
    ...font.fontSize(3),
    color: colors.white,
  },
  arrow: {
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowBottom: {
    borderTopWidth: 13,
    borderTopColor: colors.mainBlue,
    borderBottomColor: 'transparent',
  },
  arrowTop: {
    borderBottomWidth: 13,
    borderTopColor: 'transparent',
    borderBottomColor: colors.mainBlue,
  },
});

export default ModalPreview;
