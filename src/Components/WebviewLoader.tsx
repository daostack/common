import React, {ReactElement, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

interface Props {
  isLoggedIn: boolean;
}

export function WebviewLoader({isLoggedIn}: Props): ReactElement {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (!isLoading) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require('~/Assets/full-screen-loader.png')}
      />
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 64,
  },
});
