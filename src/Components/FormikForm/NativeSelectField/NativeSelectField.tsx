import {Picker} from '@react-native-picker/picker';
import React, {ReactElement, useCallback, useState} from 'react';
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, layout} from '~/Theme';
import ValidationMessage from '../ValidationMessage';
import {styles} from './styles';

type PickerItem = {
  label: string;
  value: string;
};

type Props = {
  onChange: (value: PickerItem) => void;
  label: string;
  initialValue?: string;
  viewStyle?: ViewStyle | ViewStyle[];
  errorMessage?: string | boolean;
  options: PickerItem[];
  placeholder: string;
};

const HIT_SLOP = {top: 4, right: 4, bottom: 4, left: 4};

const getOption = (options: PickerItem[], value?: string) => {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value);
};

const getOptionIndex = (options: PickerItem[], value?: string) => {
  if (!value) {
    return 0;
  }

  const optionIndex = options.findIndex((option) => option.value === value);
  if (optionIndex >= 0) {
    return optionIndex;
  } else {
    return 0;
  }
};

export const NativeSelectField = ({
  onChange,
  viewStyle,
  label,
  initialValue,
  errorMessage,
  options,
  placeholder,
}: Props): ReactElement => {
  const [selectedItem, setSelectedItem] = useState(
    getOption(options, initialValue),
  );
  const [isOpenPicker, setOpenPicker] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    getOptionIndex(options, initialValue),
  );

  function onRightArrow() {
    const itemIndex = selectedIndex || 0;
    if (itemIndex !== options.length - 1) {
      setSelectedIndex(itemIndex + 1);
    }
  }

  function onLeftArrow() {
    const itemIndex = selectedIndex || 0;
    if (itemIndex !== 0) {
      setSelectedIndex(itemIndex - 1);
    }
  }

  const InputAccessoryView = () => (
    <View style={styles.modalViewMiddle}>
      <View style={styles.chevronContainer}>
        <Pressable
          style={({pressed}) => [
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
          hitSlop={HIT_SLOP}
          onPress={onLeftArrow}>
          <View
            style={[styles.chevron, styles.chevronUp, styles.chevronActive]}
          />
        </Pressable>
        <Pressable
          style={({pressed}) => [
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
          hitSlop={HIT_SLOP}
          onPress={onRightArrow}>
          <View
            style={[styles.chevron, styles.chevronDown, styles.chevronActive]}
          />
        </Pressable>
      </View>
      <Pressable
        style={({pressed}) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        onPress={() => {
          setOpenPicker(false);
          if (Number.isInteger(selectedIndex)) {
            onChange(options[selectedIndex]);
            setSelectedItem(options[selectedIndex]);
          } else {
            setSelectedIndex(0);
            onChange(options[0]);
            setSelectedItem(options[0]);
          }
        }}
        hitSlop={HIT_SLOP}>
        <Text testID="done_text" allowFontScaling={false} style={styles.done}>
          Done
        </Text>
      </Pressable>
    </View>
  );

  const renderItems = useCallback(
    () =>
      options.map((item) => (
        <Picker.Item key={item.label} label={item.label} value={item.value} />
      )),
    [options],
  );

  const renderAndroid = () => (
    <Pressable
      style={({pressed}) => [
        {
          opacity: pressed ? 0.7 : 1,
          width: '100%',
        },
        viewStyle,
      ]}>
      <View pointerEvents="box-only" style={styles.pickerValueContainer}>
        <Text
          style={[
            styles.pickerValue,
            {
              opacity: selectedItem?.label ? 1 : 0.4,
            },
          ]}>
          {selectedItem?.label ?? placeholder}
        </Text>
        <Icon name="down-arrow" color={colors.black} size={16} />
      </View>
      <Picker
        style={[{backgroundColor: 'transparent'}, styles.headlessAndroidPicker]}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedIndex(itemIndex);
          onChange(options[itemIndex]);
        }}
        selectedValue={selectedItem?.value}>
        {renderItems()}
      </Picker>
    </Pressable>
  );

  const renderIOS = () => (
    <>
      <Pressable
        onPress={() => {
          setOpenPicker(true);
        }}
        style={({pressed}) => [
          {
            opacity: pressed ? 0.4 : 1,
          },
          styles.pickerValueContainer,
        ]}>
        <Text
          style={[
            styles.pickerValue,
            {
              opacity: selectedItem?.label ? 1 : 0.4,
            },
          ]}>
          {selectedItem?.label ?? placeholder}
        </Text>
        <Icon
          name={`${isOpenPicker ? 'up' : 'down'}-arrow`}
          color={colors.black}
          size={16}
        />
      </Pressable>
      <Modal
        visible={isOpenPicker}
        transparent
        animationType="slide"
        supportedOrientations={['portrait']}>
        <TouchableOpacity
          style={styles.modalViewTop}
          onPress={() => {
            setOpenPicker(true);
          }}
        />
        <InputAccessoryView />
        <View style={styles.modalViewBottom}>
          <Picker
            onValueChange={(itemValue, itemIndex) => {
              setSelectedIndex(itemIndex);
            }}
            selectedValue={options[selectedIndex].value}>
            {renderItems()}
          </Picker>
        </View>
      </Modal>
    </>
  );

  return (
    <View style={[styles.viewContainer, viewStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {Platform.OS === 'ios' ? renderIOS() : renderAndroid()}
      {errorMessage && (
        <View style={layout.marginTopXXS}>
          <ValidationMessage errorMessage={errorMessage} />
        </View>
      )}
    </View>
  );
};
