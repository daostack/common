import {useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import {colors, font} from '~/Theme';
import React from 'react';
import Pdf from 'react-native-pdf';
import {useNavigation} from '@react-navigation/native';

const PDFViewer = ({route}) => {
  const uri = route.params.uri;
  const [pages, setPages] = useState(0);
  const [currPage, setCurrPage] = useState(0);
  const hideIndex = route.params.hideIndex || false;
  const navigation = useNavigation();
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
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(currUri) => {
            console.log(`Link presse: ${currUri}`);
            navigation.navigate('Browser', {url: currUri});
          }}
          style={styles.pdf}
        />
      </View>
      {hideIndex ? (
        <></>
      ) : (
        <View style={styles.index}>
          <Text style={styles.pager}>
            {currPage} of {pages}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pager: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
  },
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
