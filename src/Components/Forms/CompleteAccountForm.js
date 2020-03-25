import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TextInputField from '../FormFields/TextInputField';
import {observer, inject} from 'mobx-react';
import {layout, text} from '../../Theme';

class CompleteAccountForm extends React.Component {
  static FIELD_NAME = 'name';
  static FIELD_INTRO = 'Intro';

  formSave() {}

  render() {
    const {formStore, ...otherProps} = this.props;

    return (
      <View
        {...otherProps}
        style={{
          alignSelf: 'stretch',
          flexGrow: 1,
          marginTop: 15,
        }}>
        <TextInputField
          viewStyle={{alignSelf: 'stretch'}}
          label="Name"
          placeholderText="Firstname Lastname"
          autoCapitalize="none"
          autoCorrect={false}
          value="Lyubomir Petkov"
          validation={{
            name: CompleteAccountForm.FIELD_NAME,
            formStore: this.props.completeAccountFormStore,
            validateRule: 'required',
          }}
        />
        <TextInputField
          label="Intro"
          placeholderText="What are you passionate about, really good at or love"
          validation={{
            name: CompleteAccountForm.FIELD_INTRO,
            formStore: this.props.completeAccountFormStore,
            validateRule: 'required',
          }}
        />

        <View style={styles.containerRow}>
          <TouchableOpacity
            style={{...layout.btnOutline, ...layout.marginRightS}}
            onPress={this.formSave}>
            <Text style={text.buttonblue}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...layout.btnPrimary, ...layout.marginLeftS}}
            onPress={this.formSave}>
            <Text style={text.buttoncenterwhite}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 160,
  },
});

export default inject('completeAccountFormStore')(
  observer(CompleteAccountForm),
);
