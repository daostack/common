import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNRestart from 'react-native-restart';
import {colors, font} from '~/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    width: Dimensions.get('window').width,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('window').width * 0.45,
    maxHeight: 220,
    aspectRatio: 1,
  },

  textContainer: {
    marginTop: 30,
    width: Dimensions.get('window').width * 0.6,
  },

  button: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: colors.grey4,
    marginVertical: 30,
  },

  title: {
    ...font.primary.bold,
    ...font.fontSize(3),
    textAlign: 'center',
  },
});

export class ErrorBoundary extends React.Component {
  state = {hasError: false};

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={require('~/Assets/alert.png')}
              style={styles.image}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title]}>{'Something went wrong'}</Text>
          </View>

          <TouchableOpacity
            onPress={() => RNRestart.Restart()}
            style={styles.button}>
            <Text>{'OK'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
