import React, {useState} from 'react';
import {Text, View, ScrollView, Pressable, Linking} from 'react-native';
import {func, InferProps} from 'prop-types';
import styles from './styles';
import data from './data';
import Icon from '~/Assets/iconfont/Icon';

const props = {
  onPressAgree: func,
};
const UseAcknowledgment: React.FC<InferProps<typeof props>> = ({onPressAgree}) => {
  const [agreedWithStatement, setAgreedWithStatement] = useState(false);
  const [causesExpanded, setCausesExpanded] = useState(false);
  return (
    <View style={styles.root}>
      <View style={styles.view}>
        <View style={styles.plug} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.acknowledgment}><Icon name="acknowledgement-116" size={116} /></View>
          <Text style={styles.title}>{data.useAcknowledgmentTitle}</Text>
          <Text style={[styles.text, styles.centerText]}>{data.useAcknowledgmentText}</Text>
          <View style={styles.line} />
          {[data.notViolation, data.npnProfitCauses, data.financialObligations].map((text, index) =>
            <View key={index} style={styles.item}>
              <View style={styles.checkMark}><Icon name="checkMark" size={24} /></View>
              <Text style={[styles.text, styles.flex]}>{text}</Text>
            </View>
          )}
          <Pressable onPress={() => setCausesExpanded(!causesExpanded)}>
            <View style={styles.item}>
              <View style={styles.checkMark}><Icon name="checkMark" size={24} /></View>
              <Text style={[styles.flex, styles.text]}>
                <Text>{data.promoteCauses}</Text>
                <Text style={[styles.causesText, styles.underlined]}>{data.causes}</Text>
                <Text>{' '}</Text>
                <Icon name="questionMark" size={12} style={styles.questionMark} />
                <Text style={styles.causesText}>.</Text>
              </Text>
            </View>
          </Pressable>
          {causesExpanded && <Text style={styles.highlighted}>{data.causesText}</Text>}
          <Pressable onPress={() => Linking.openURL(data.termsOfUseUrl)}>
            <Text style={styles.terms}>
              <Text style={styles.smallText}>{data.termsOfUseRefer}</Text>
              <Text style={styles.underlinedText}>{data.termsOfUse}</Text>
            </Text>
          </Pressable>
          <Pressable onPress={() => setAgreedWithStatement(!agreedWithStatement)}>
            <View style={styles.item}>
              <View style={styles.checkMark}><Icon name={agreedWithStatement ?  'checkIconSelected' : 'checkIcon'} size={24} /></View>
              <Text style={[styles.agreeText, styles.flex]}>{data.agreeWithAbove}</Text>
            </View>
          </Pressable>
          <Pressable onPress={onPressAgree} disabled={!agreedWithStatement}>
            <Text style={[styles.button, agreedWithStatement && styles.buttonSelected]}>{data.continueFunding}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );};
UseAcknowledgment.propTypes = props;

export default UseAcknowledgment;
