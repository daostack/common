import {observable, action, decorate} from 'mobx';
import Validator from 'validatorjs';
import en from 'validatorjs/src/lang/en';

class FormStore {
  form;
  multiFieldNames;

  constructor() {
    // Hack for React Native - it's necessary to set a default language
    Validator.setMessages('en', en);
    this.clearFormStoreState();
  }

  clearFormStoreState = () => {
    this.form = {
      fields: {},
      meta: {
        isValid: false,
        formValidationMade: false,
        error: '',
        submitError: '',
        isLoadingSubmit: false,
      },
    };
    this.multiFieldNames = [];
  }

  getFormField = (name, multiName) => {
    if (multiName) {
      const multiIndexInfo = name.split('_');
      const currMultiIndex = multiIndexInfo[0];
      const currMultiValueField = multiIndexInfo[1];

      if (currMultiValueField) {
        if (this.form.fields[multiName]) {
          if (this.form.fields[multiName][currMultiIndex]) {
            return this.form.fields[multiName][currMultiIndex][currMultiValueField];
          }
          return null;
        }
        return null;
      } else {
        if (this.form.fields[multiName]) {
          return this.form.fields[multiName][currMultiIndex];
        }
        return null;
      }
    } else {
      return this.form.fields[name];
    }
  }

  registerValidationRule(ruleName, callback, validationMessage) {
    Validator.register(ruleName, callback, validationMessage);
  }

  // Public functions
  registerFormField(name, validateRule, initialValue = '', multiName = null) {
    let currValue = {
      value: initialValue,
      error: false,
      rule: validateRule,
      changed: false,
    };

    let currName = name;

    if (multiName) {
      const multiIndexInfo = name.split('_');
      const currMultiIndex = multiIndexInfo[0];
      const currMultiValueField = multiIndexInfo[1];

      if (currMultiValueField) {
        let currMultiValue = this.form.fields[multiName] ? this.form.fields[multiName] : {};
        if (!currMultiValue[currMultiIndex]) {
          currMultiValue[currMultiIndex] = {};
        }
        currMultiValue[currMultiIndex][currMultiValueField] = currValue;
        currValue = currMultiValue;
      } else {

        if (!this.form.fields[multiName]) {
          this.form.fields[multiName] = [];
        }
        this.form.fields[multiName][name] = currValue;
        currValue = this.form.fields[multiName];

      }

      currName = multiName;
    }

    this.form.fields[currName] = currValue;
  }

  updateFieldValidationRule(name, multiName, newRule) {
    this.getFormField(name, multiName).rule = newRule;
    this.validateField(name, multiName);
  }

  removeFormField(name, multiName) {
    if (multiName) {
      const multiIndexInfo = name.split('_');
      const currMultiIndex = multiIndexInfo[0];

      if (this.form.fields[multiName][currMultiIndex]) {
        let currFormField = this.form.fields[multiName];
        delete currFormField[currMultiIndex];

        const newFormFieldObj = {};
        let newIndex = 0;

        Object.keys(currFormField).forEach((currKey) => {
          newFormFieldObj[newIndex] = currFormField[currKey];
          newIndex++;
        });
        this.form.fields[multiName] = newFormFieldObj;
      }

    } else {
      delete this.form.fields[name];
    }
  }

  // Check if form is valid and display error for each form field if it's necessary
  isFormValid = () => {
    this.form.meta.formValidationMade = true;
    var validation = this.getValidator();
    this.form.meta.isValid = validation.passes();
    if (!this.form.meta.isValid) {
      for (const key in validation.errors.errors) {
        this.form.fields[key].error = validation.errors.first(key);
      }
      return false;
    }
  };

  // Determine if the form action button has to be disabled
  isFormActionEnabled = () => (
    this.form.meta.formValidationMade ? this.form.meta.isValid : true
  );

  fieldBlured = (name, multiName) => {
    this.validateField(name, multiName);
  };

  fieldChanged = (name, value, triggerValidation = false, multiName = null) => {
    this.getFormField(name, multiName).value = value;

    if (
      triggerValidation ||
      this.getFormField(name, multiName).error ||
      !this.getFormField(name, multiName).value
    ) {
      this.validateField(name, multiName);
    }
    this.getFormField(name, multiName).changed = true;
  };

  getFormFieldsJson = (onlyChangedFields = false) => {
    let changedFieldsJson = {};

    for (const key in this.form.fields) {
      const formField = this.form.fields[key];
      const currValue = typeof (formField.value) === 'object' ? formField.value.value : formField.value;
      if (onlyChangedFields) {
        if (formField.changed) {
          changedFieldsJson[key] = currValue;
          // formField.value.length > 0 ? changedFieldsJson[key] = formField.value : null;
        }
      } else {
        changedFieldsJson[key] = currValue;
      }
    }

    // // Filter multiple fields
    // for (const key in this.multiFieldNames) {
    //   const currMultiName = this.multiFieldNames[key];
    //   changedFieldsJson = this.filterMultiFields(
    //     currMultiName,
    //     changedFieldsJson,
    //   );
    // }

    return changedFieldsJson;
  };


  getChangedFormFieldsJson = () => (
    this.getFormFieldsJson(true)
  );

  filterMultiFields = (name, fields) => {
    let changedFieldsJson = {};

    // MultiLink
    let multiFieldTitles = [];
    let multiFieldValues = [];

    // MultiFile and MultiImage
    let multiValues = [];

    for (const key in fields) {
      const formFieldValue = fields[key];

      if (key.startsWith(`${name}_title`)) {
        multiFieldTitles = multiFieldTitles.concat(formFieldValue);
        continue;
      }

      if (key.startsWith(`${name}_value`)) {
        multiFieldValues = multiFieldValues.concat(formFieldValue);
        continue;
      }

      if (key.startsWith(`${name}_multi`)) {
        multiValues = multiValues.concat(formFieldValue);
        continue;
      }

      changedFieldsJson[key] = formFieldValue;
    }

    if (multiValues.length > 0) {
      changedFieldsJson[name] = [...multiValues.keys()].map((x) => ({value: multiValues[x]}) );
    }

    if (multiFieldTitles.length > 0) {
      const allMultiLinksFields = [...multiFieldTitles.keys()].map((x) => (
        {title: multiFieldTitles[x], url: multiFieldValues[x]}
      ));
      // Remove fields with empty values.
      changedFieldsJson[name] = allMultiLinksFields.filter((item) => item.title || item.url);
    }

    if (changedFieldsJson.length === 0) {
      changedFieldsJson[name] = [];
    }

    return changedFieldsJson;
  };

  isFormChanged = () => (
    Object.keys(this.getChangedFormFieldsJson()).length > 0
  );

  // Private functions
  validateField = (name, multiName) => {
    var validation = this.getValidator(name, multiName);
    this.form.meta.isValid = validation.passes();
    this.getFormField(name, multiName).error = validation.errors.first(name);
    if (this.getFormField(name, multiName).error) {
      this.form.meta.formValidationMade = true;
    }
  };

  getValidator = (name, multiName) => {
    let validatorParams = this.getValidatorParams(name, multiName);
    return new Validator(
      validatorParams.fieldsData,
      validatorParams.fieldsRule,
    );
  };

  getValidatorParams = (fieldName, multiField) => {

    let fieldsData = {};
    let fieldsRule = {};

    if (fieldName) {
      const formField = this.getFormField(fieldName, multiField);
      fieldsData[fieldName] = typeof (formField.value) === 'object' ? formField.value.value : formField.value;
      fieldsRule[fieldName] = formField.rule;
    } else {
      for (const key in this.form.fields) {
        const formField = this.form.fields[key];
        //Multi field
        if (Array.isArray(formField)) {
          formField.forEach((currMultiFormField, multiIndex) => {
            // MultiLink
            if (Array.isArray(currMultiFormField)) {
              formField.forEach((currMultiMultiFormField, multiMultiIndex) => {
                const multiKey = `${key}_${multiIndex}_${multiMultiIndex}`;
                fieldsData[multiKey] = typeof (currMultiMultiFormField.value) === 'object' ? currMultiMultiFormField.value.value : currMultiMultiFormField.value;
                fieldsRule[multiKey] = currMultiMultiFormField.rule;
              });
            } else { //MultiFiles & MultiImages
              const multiKey = `${key}_${multiIndex}`;
              fieldsData[multiKey] = typeof (currMultiFormField.value) === 'object' ? currMultiFormField.value.value : currMultiFormField.value;
              fieldsRule[multiKey] = currMultiFormField.rule;
            }
          });
        } else {
          fieldsData[key] = typeof (formField.value) === 'object' ? formField.value.value : formField.value;
          fieldsRule[key] = formField.rule;
        }
      }
    }

    return {
      fieldsData: fieldsData,
      fieldsRule: fieldsRule,
    };
  };

  setError = (errMsg) => {
    this.form.meta.error = errMsg;
  };
}

decorate(FormStore, {
  setError: action,
  fieldChanged: action,
  fieldBlured: action,
  form: observable,
});

export default FormStore;
