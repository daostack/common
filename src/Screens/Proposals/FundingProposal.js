import React from 'react';
import {
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {text, layout, colors, sizeM} from '../../Theme';
import FundingRequestForm from '../../Components/Forms/FundingRequestForm';

const FundingProposal = ({}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
          contentContainerStyle={layout.content}>
          <Text style={styles.title}>Funding request</Text>
          <Text style={styles.subtitle}>
            If a majority approves your initiative the funds (and
            responsibility) are yours.
          </Text>

          <FundingRequestForm />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.h3Black,
    ...layout.marginTopM,
    textAlign: 'left',
  },
  subtitle: {
    ...text.blackText,
    ...layout.marginTopXL,
    ...layout.marginBottomM,
    textAlign: 'center',
  },
});

export default FundingProposal;
