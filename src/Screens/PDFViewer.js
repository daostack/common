import {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {colors, text, layout} from '../Theme';
import React from 'react';
import Icon from '../Assets/iconfont/Icon';
import Pdf from 'react-native-pdf';

const PDFViewer = ({props, route, navigation}) => {
  const uri = route.params.uri;
  const [pages, setPages] = useState(0);
  const [currPage, setCurrPage] = useState(0);
  const hideIndex = route.params.hideIndex || false;
  return (
    <SafeAreaView flex={1}>
      <View style={styles.container}>
        <Pdf
          source={{
            uri: uri,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            setPages(numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            setCurrPage(page);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link presse: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
      {hideIndex ? (
        <></>
      ) : (
        <View style={styles.index}>
          <Text style={{color: colors.black}}>
            {currPage}/{pages}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  index: {
    padding: 10,
    backgroundColor: colors.grey4,
    position: 'absolute',
    top: 20,
    left: 20,
    opacity: 0.6,
    borderRadius: 10,
  },
});

export default PDFViewer;
