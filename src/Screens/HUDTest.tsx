import React, {useRef, useCallback} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Toast from '~/Util/Toast';

export default function HUDTest() {
  const timerRef = useRef<number>(null);

  const loading = useCallback(() => {
    Toast.loading('Loading...');
    timerRef.current = setTimeout(() => {
      Toast.done('Work is done!');
      timerRef.current = setTimeout(() => {
        Toast.loading('New task in progress...');
        timerRef.current = setTimeout(() => {
          timerRef.current = undefined;
          Toast.hide();
        }, 2000);
      }, 1500);
    }, 2000);
  }, []);

  const text = () => {
    Toast.text('Hello World!!');
    // toast.text('Hello World!!')
  };

  const info = () => {
    Toast.info(
      'A long long message to tell you, A long long message to tell you, A long long message to tell you',
    );
  };

  const done = () => {
    Toast.done('Work is Done！');
  };

  const success = () => {
    Toast.success('Work is Done！');
  };

  const error = () => {
    Toast.error('Maybe somthing is wrong！');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={loading}
        activeOpacity={0.2}
        style={styles.button}>
        <Text style={styles.buttonText}> loading </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={text}
        activeOpacity={0.2}
        style={styles.button}>
        <Text style={styles.buttonText}> text </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={info}
        activeOpacity={0.2}
        style={styles.button}>
        <Text style={styles.buttonText}> info </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={done}
        activeOpacity={0.2}
        style={styles.button}>
        <Text style={styles.buttonText}> done </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={success}
        activeOpacity={0.2}
        style={styles.button}>
        <Text style={styles.buttonText}> success</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={error}
        activeOpacity={0.2}
        style={styles.button}>
        <Text style={styles.buttonText}> error </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 40,
    backgroundColor: 'grey',
    marginVertical: 20,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
  },

  text: {
    fontSize: 16,
    alignSelf: 'flex-start',
    textAlign: 'left',
    margin: 8,
  },
});
