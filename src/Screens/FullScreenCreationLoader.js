import React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {colors, layout, font} from '~/Theme';
import Loader from '~/Components/Loader';
import {string, shape} from 'prop-types';

import quotes from '../Util/quotes.json';
import {useQuote} from '../Util/hooks/useQuote';

const FullScreenCreationLoader = ({route: {params: {title = '', message = ''}}}) => {
  const quote = useQuote();

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content"/>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.body}>
          <View style={{...styles.slide1, ...layout.content}}>
            <Image
              source={require('~/Assets/creating-a-common.png')}
              style={styles.image}
            />

            <Loader />

            <Text style={styles.title}>
              {title}
            </Text>

            <Text style={styles.subtitle}>
              {message || 'This may take up to 2 minutes'}
            </Text>

            <View style={styles.quotesContainer}>
              <Text style={styles.quote}>{quote.quote}</Text>
              <Text style={styles.quoteAuthor}>{quote.author}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </React.Fragment>
  );
};

FullScreenCreationLoader.propTypes = {
  route: shape({
    params: shape({
      title: string,
      message: string,
    }),
  }),
};

const styles = StyleSheet.create({
  title: {
    ...font.primary.semiBold,
    ...font.fontSize(2),
    ...layout.marginTopXL,
    color: colors.black,
  },

  subtitle: {
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.greyText,
  },

  quotesContainer: {
    ...layout.marginTopL,
  },

  quote: {
    ...font.heading.bold,
    ...font.fontSize(3),
    color: colors.black,
    textAlign: 'center',
  },

  quoteAuthor: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.greyText,
    textAlign: 'center',
  },


  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  creatingText: {
    ...font.heading.bold,
    ...font.fontSize(6),
    ...layout.marginTopXL,
    ...layout.marginBottomXL,
    textAlign: 'center',
  },
  waitText: {
    ...font.primary.regular,
    ...font.fontSize(4),
    textAlign: 'center',
  },
  body: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
  },
  sectionContainer: {
    marginTop: 22,
    marginBottom: 34,
  },
  buttonConatiner: {
    marginTop: 22,
    marginBottom: 22,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 24,
    backgroundColor: '#3cc7e1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  shareButton: {
    width: '80%',
    alignSelf: 'center',
  },
  continueButton: {
    width: '80%',
    height: 48,
    alignSelf: 'center',
    borderRadius: 32,
    marginTop: 45,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
  },
  image: {
    top: 0,
    width: '100%',
    height: '50%',
    // backgroundColor: '#efefef',
  },
  wrapper: {},
  slide1: {
    flex: 1,
  },
});

export default FullScreenCreationLoader;
