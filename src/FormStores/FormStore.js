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

  registerValidationRule(validationRule) {
    Validator.register(validationRule.ruleName, validationRule.validateFunc, validationRule.errorMessage);
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
        let currMultiValue = this.form.fields[multiName] ? this.form.fields[multiName] : [];
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

  removeFormField(name, multiIndex) {
    if (multiIndex) {
      if (this.form.fields[name] && this.form.fields[name][multiIndex]) {
        let currFormField = this.form.fields[name];
        delete currFormField[multiIndex];

        const newFormFieldObj = [];
        let newIndex = 0;

        Object.keys(currFormField).forEach((currKey) => {
          newFormFieldObj[newIndex] = currFormField[currKey];
          newIndex++;
        });
        this.form.fields[name] = newFormFieldObj;
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
    }
    return this.form.meta.isValid;
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
      let currValue = null;

      if (Array.isArray(formField)) {
        currValue = [];
        formField.forEach((currMultiFormField, multiIndex) => {
          const multiFieldValue = {};
          const nextIndex = currValue.length;
          // Multi Links
          if (typeof (currMultiFormField.value) === 'object') {
            Object.keys(currMultiFormField).forEach((currKey) => {
              // Skip Multi Rules & Links fields with empty string values.
              // That's happening because for those component we render the Input fields even if they are not used. That leads to register their values in the store.
              // For MultiFiles & Images components that's not in this way, because we don't have a default value for initial rendering.
              // TODO: In order to not keep these empty strings as values we need a change in the UI. Probably we can make it in the same way as the Multi Files & Images.
              if (currMultiFormField[currKey].value && currMultiFormField[currKey].value.length > 0) {
                if (onlyChangedFields) {
                  if (currMultiFormField[currKey].changed) {
                    multiFieldValue[currKey] = currMultiFormField[currKey].value;
                  }
                } else {
                  multiFieldValue[currKey] = currMultiFormField[currKey].value;
                }
              }
            });
          } else { // MultiFiles & MultiImages
            if (onlyChangedFields) {
              if (currMultiFormField.changed) {
                multiFieldValue.value = currMultiFormField.value;
              }
            } else {
              multiFieldValue.value = currMultiFormField.value;
            }
          }
          if (Object.keys(multiFieldValue).length > 0) {
            currValue[nextIndex] = multiFieldValue;
          }
        });
      } else { // Single Field
        if (onlyChangedFields) {
          if (formField.changed) {
            currValue = formField.value;
            // formField.value.length > 0 ? changedFieldsJson[key] = formField.value : null;
          }
        } else {
          currValue = formField.value;
        }
      }

      let currFieldValue = null;

      if (currValue) {
        let nonZeroLength = false;
        // Multiple field
        if (Array.isArray(currValue)) {
          nonZeroLength = currValue.length > 0;
          currFieldValue = currValue;
        }
        // Single field with object value (ex: dropdown field -> {value: 'val', index: 0})
        else if (typeof (currValue) === 'object') {
          nonZeroLength = Object.keys(currValue).length > 0;
          currFieldValue = currValue.value;
        }
        // Single field with single value
        else {
          nonZeroLength = currValue.length > 0;
          currFieldValue = currValue;
        }

        if (nonZeroLength) {
          changedFieldsJson[key] = currFieldValue;
        }
      }
    }

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
      changedFieldsJson[name] = [...multiValues.keys()].map((x) => ({value: multiValues[x]}));
    }

    if (multiFieldTitles.length > 0) {
      const allMultiLinksFields = [...multiFieldTitles.keys()].map((x) => (
        {title: multiFieldTitles[x], url: multiFieldValues[x]}
      ));
      // Remove fields with empty values.
      changedFieldsJson[name] = allMultiLinksFields.filter((item) => item.title || item.value);
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
    const isCurrFieldValid = validation.passes();
    if (isCurrFieldValid) {
      // validate the rest of the fields in case of valid current field.
      this.form.meta.isValid = this.getValidator().passes();
    } else {
      this.form.meta.isValid = false;
    }
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
            if (typeof (currMultiFormField.value) === 'object') {
              Object.keys(currMultiFormField).forEach((currKey) => {
                const multiKey = `${key}_${multiIndex}_${currKey}`;
                fieldsData[multiKey] = currMultiFormField[currKey].value;
                fieldsRule[multiKey] = currMultiFormField[currKey].rule;
              });
            } else { //MultiFiles & MultiImages
              const multiKey = `${key}_${multiIndex}`;
              fieldsData[multiKey] = currMultiFormField.value;
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
