import {Picker} from '@react-native-picker/picker';
import React, {ReactElement, useState} from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import {ItemType} from 'react-native-dropdown-picker';
import Icon from '~/Assets/iconfont/Icon';
import {colors} from '~/Theme';
import ValidationMessage from './ValidationMessage';

type Props = {
  onChange: (value: string) => void;
  label: string;
  viewStyle?: ViewStyle | ViewStyle[];
  errorMessage?: string | boolean;
  options: ItemType[];
  placeholder: string;
};

function ErrorMessage({
  errorMessage,
}: Pick<Props, 'errorMessage'>): ReactElement {
  return <ValidationMessage errorMessage={errorMessage} />;
}

const LANGUAGES = [
  {label: 'Java', value: 'java'},
  {label: 'JavaScript', value: 'javascript'},
  {label: 'Python', value: 'python'},
];

export const NativeSelectField = (): ReactElement => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [togglePicker, setTogglePicker] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  function onRightArrow() {
    const itemIndex = selectedIndex || 0;
    if (itemIndex !== LANGUAGES.length - 1) {
      setSelectedIndex(itemIndex + 1);
    }
  }

  function onLeftArrow() {
    const itemIndex = selectedIndex || 0;
    if (itemIndex !== 0) {
      setSelectedIndex(itemIndex - 1);
    }
  }

  const renderInputAccessoryView = () => (
    <View style={styles.modalViewMiddle} testID="input_accessory_view">
      <View style={styles.chevronContainer}>
        <TouchableOpacity activeOpacity={0.5} onPress={onLeftArrow}>
          <View
            style={[styles.chevron, styles.chevronUp, styles.chevronActive]}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={onRightArrow}>
          <View
            style={[styles.chevron, styles.chevronDown, styles.chevronActive]}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        testID="done_button"
        onPress={() => {
          setTogglePicker(false);
          if (Number.isInteger(selectedIndex)) {
            setSelectedLanguage(LANGUAGES[selectedIndex].label);
          } else {
            setSelectedIndex(0);
            setSelectedLanguage(LANGUAGES[0].label);
          }
        }}
        hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}>
        <Text testID="done_text" allowFontScaling={false} style={styles.done}>
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItems = () =>
    LANGUAGES.map(({label, value}) => (
      <Picker.Item key={label} label={label} value={value} />
    ));

  if (Platform.OS === 'android') {
    return (
      <Pressable
        style={({pressed}) => [
          {
            opacity: pressed ? 0.7 : 1,
            width: '100%',
          },
        ]}>
        <View pointerEvents="box-only" style={styles.labelContainer}>
          <Text
            style={{
              color: '#001a36',
              opacity: Number.isInteger(selectedIndex) ? 1 : 0.4,
            }}>
            {LANGUAGES[selectedIndex]?.label ?? 'Bank Leumi'}
          </Text>
          <Icon name="down-arrow" color={colors.black} size={16} />
        </View>
        <Picker
          style={[
            {backgroundColor: 'transparent'},
            styles.headlessAndroidPicker,
          ]}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedIndex(itemIndex);
          }}
          selectedValue={selectedLanguage}>
          {renderItems()}
        </Picker>
      </Pressable>
    );
  }

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity
        onPress={() => {
          setTogglePicker(true);
        }}
        style={styles.labelContainer}
        activeOpacity={1}>
        <Text
          style={{
            color: '#001a36',
            opacity: Number.isInteger(selectedIndex) ? 1 : 0.4,
          }}>
          {selectedLanguage ?? 'Bank Leumi'}
        </Text>
        <Icon
          name={`${togglePicker ? 'up' : 'down'}-arrow`}
          color={colors.black}
          size={16}
        />
      </TouchableOpacity>
      <Modal
        visible={togglePicker}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setTogglePicker(false);
        }}
        supportedOrientations={['portrait']}>
        <TouchableOpacity
          style={styles.modalViewTop}
          onPress={() => {
            setTogglePicker(true);
          }}
        />
        {renderInputAccessoryView()}
        <View style={[styles.modalViewBottom, {height: 215}]}>
          <Picker
            onValueChange={(itemValue, itemIndex) => {
              setSelectedIndex(itemIndex);
            }}
            selectedValue={LANGUAGES[selectedIndex]?.value}>
            {renderItems()}
          </Picker>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  modalViewTop: {
    flex: 1,
  },
  modalViewBottom: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalViewMiddle: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#dedede',
    zIndex: 2,
  },
  chevronContainer: {
    flexDirection: 'row',
  },
  chevron: {
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
    borderColor: '#a1a1a1',
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  chevronUp: {
    marginLeft: 11,
    transform: [{translateY: 0}, {rotate: '-135deg'}],
  },
  chevronDown: {
    marginLeft: 22,
    transform: [{translateY: 0}, {rotate: '45deg'}],
  },
  chevronActive: {
    borderColor: '#007aff',
  },
  done: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 17,
    paddingTop: 1,
    paddingRight: 11,
  },
  headlessAndroidPicker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: 'transparent',
    opacity: 0,
  },
  labelContainer: {
    height: 48,
    width: '100%',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
