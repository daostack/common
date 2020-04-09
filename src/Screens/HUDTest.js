import React, {useEffect, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Toast, {useToast} from '../Util/Toast';

export default function HUDTest() {
  const timerRef = useRef();

  useEffect(() => {
    Toast.config({
      // backgroundColor: '#BB000000',
      // tintColor: '#FFFFFF',
      // cornerRadius: 5, // only for android
      // duration: 2000,
      // graceTime: 300,
      // minShowTime: 800,
      // dimAmount: 0.0, // only for andriod
      loadingText: 'Loading...',
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  });

  const toast = useToast();

  const loading = useCallback(() => {
    toast.loading();
    timerRef.current = setTimeout(() => {
      toast.done('Work is done!');
      timerRef.current = setTimeout(() => {
        toast.loading('New task in progress...');
        timerRef.current = setTimeout(() => {
          timerRef.current = undefined;
          toast.hide();
        }, 2000);
      }, 1500);
    }, 2000);
  }, [toast]);

  const text = () => {
    Toast.text('Hello World!!');
    // toast.text('Hello World!!')
  };

  const info = () => {
    toast.info(
      'A long long message to tell you, A long long message to tell you, A long long message to tell you',
    );
  };

  const done = () => {
    toast.done('Work is Done！');
  };

  const error = () => {
    toast.error('Maybe somthing is wrong！');
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
