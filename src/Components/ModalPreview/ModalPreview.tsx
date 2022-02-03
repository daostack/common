import React, {ReactNode} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  POSITION_ARROW,
  POSITION_ARROW_TOP,
  POSITION_ARROW_BOTTOM,
} from '~/Util/constants/positionArrow.enum';

import Arrow from './Arrow';
import {styles} from './styles';

interface Props {
  showModal: boolean;
  closeModal: () => void;
  title: string;
  description: string;
  positionArrow: POSITION_ARROW;
  arrowMarginRight?: number;
  arrowMarginLeft?: number;
  modalPosition?: StyleProp<ViewStyle>;
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
}: Props) => (
  <>
    {!showModal && children}
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onRequestClose={closeModal}>
      <View style={styles.background}>
        <View style={{...styles.container, ...(modalPosition as ViewStyle)}}>
          {POSITION_ARROW_TOP.includes(positionArrow) && (
            <Arrow
              positionArrow={positionArrow}
              arrowMarginLeft={arrowMarginLeft}
              arrowMarginRight={arrowMarginRight}
            />
          )}
          <View style={styles.modal}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <TouchableOpacity style={styles.btn} onPress={closeModal}>
              <Text style={styles.btnText}>Got it</Text>
            </TouchableOpacity>
          </View>
          {POSITION_ARROW_BOTTOM.includes(positionArrow) && (
            <Arrow
              positionArrow={positionArrow}
              arrowMarginLeft={arrowMarginLeft}
              arrowMarginRight={arrowMarginRight}
            />
          )}
        </View>
        {children}
      </View>
    </Modal>
  </>
);

export default ModalPreview;
