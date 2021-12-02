import React, {ReactElement} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface TooltipComponentProps {
  handleStop: () => void;
}

export const TooltipComponent = ({handleStop}: TooltipComponentProps): ReactElement => (
  <View style={styles.container}>
    <Text style={styles.text}>Do you support this proposal?</Text>
    <Text style={styles.smallText}>Every vote makes an impact</Text>
    <TouchableOpacity style={styles.button} onPress={handleStop}>
      <Text style={styles.buttonText}>Got it</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  text: {
    width: 270,
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 7,
  },
  smallText: {
    width: 270,
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    position: 'absolute',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'white',
    width: 270,
    alignItems: 'center',
    paddingVertical: 14,
    bottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
