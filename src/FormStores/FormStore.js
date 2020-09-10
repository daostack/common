import {observable, action, decorate} from 'mobx';
import Validator from 'validatorjs';
import en from 'validatorjs/src/lang/en';

class FormStore {
  form;
  multiFieldNames;

  constructor() {
    // Hack for React Native - it's necessary to set a default language
    Validator.setMessages('en', en);
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

  registerValidationRule(ruleName, callback, validationMessage) {
    Validator.register(ruleName, callback, validationMessage);
  }

  // Public functions
  registerFormField(name, validateRule, initialValue = '', multiName = null) {
    this.form.fields[name] = {
      value: initialValue,
      error: false,
      rule: validateRule,
      changed: false,
    };
    if (multiName && this.multiFieldNames.indexOf(multiName) === -1) {
      this.multiFieldNames.push(multiName);
    }
  }

  updateFieldValidationRule(name, newRule) {
    this.form.fields[name].rule = newRule;
    this.validateField(name);
  }

  removeFormField(name) {
    if (this.form.fields?.[name]) {
      delete this.form.fields[name];
    }
  }

  // Check if form is valid and display error for each form field if it's necessary
  isFormValid = () => {
    this.form.meta.formValidationMade = true;
    var validation = this.getValidator();
    this.form.meta.isValid = validation.passes();
    console.log(this.form.meta.isValid, validation.errors.errors);
    if (!this.form.meta.isValid) {
      for (const key in validation.errors.errors) {
        this.form.fields[key].error = validation.errors.first(key);
      }
      return false;
    }

    // Filter multiple fields
    return true;
  };

  // Determine if the form action button has to be disabled
  isFormActionEnabled = () => {
    return this.form.meta.formValidationMade ? this.form.meta.isValid : true;
  };

  fieldBlured = name => {
    this.validateField(name);
  };

  fieldChanged = (name, value, triggerValidation = false) => {
    this.form.fields[name].value = value;
    if (
      triggerValidation ||
      this.form.fields[name].error ||
      !this.form.fields[name].value
    ) {
      this.validateField(name);
    }
    this.form.fields[name].changed = true;
  };

  getFormFieldsJson = (onlyChangedFields = false) => {
    let changedFieldsJson = {};

    for (const key in this.form.fields) {
      const formField = this.form.fields[key];
      if (onlyChangedFields) {
        if (formField.changed) {
          changedFieldsJson[key] = formField.value;
          // formField.value.length > 0 ? changedFieldsJson[key] = formField.value : null;
        }
      } else {
        changedFieldsJson[key] = formField.value;
      }
    }

    // Filter multiple fields
    for (const key in this.multiFieldNames) {
      const currMultiName = this.multiFieldNames[key];
      changedFieldsJson = this.filterMultiFields(
        currMultiName,
        changedFieldsJson,
      );
    }

    return changedFieldsJson;
  };


  getChangedFormFieldsJson = () => {
    return this.getFormFieldsJson(true);
  };

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
      changedFieldsJson[name] = [...multiValues.keys()].map(x => {
        return { value: multiValues[x]};
      });
    }

    if (multiFieldTitles.length > 0) {
      const allMultiLinksFields = [...multiFieldTitles.keys()].map(x => {
        return {title: multiFieldTitles[x], url: multiFieldValues[x]};
      });
      // Remove fields with empty values.
      changedFieldsJson[name] = allMultiLinksFields.filter(item => item.title || item.url);
    }

    if (changedFieldsJson.length === 0) {
      changedFieldsJson[name] = [];
    }

    return changedFieldsJson;
  };

  isFormChanged = () => {
    return Object.keys(this.getChangedFormFieldsJson()).length > 0;
  };

  // Private functions
  validateField = field => {
    var validation = this.getValidator();
    this.form.meta.isValid = validation.passes();
    this.form.fields[field].error = validation.errors.first(field);
    if (this.form.fields[field].error) {
      this.form.meta.formValidationMade = true;
    }
  };

  getValidator = () => {
    let validatorParams = this.getValidatorParams();
    return new Validator(
      validatorParams.fieldsData,
      validatorParams.fieldsRule,
    );
  };

  getValidatorParams = () => {
    let fieldsData = {};
    let fieldsRule = {};

    for (const key in this.form.fields) {
      const formField = this.form.fields[key];
      fieldsData[key] = formField.value;
      fieldsRule[key] = formField.rule;
    }

    return {
      fieldsData: fieldsData,
      fieldsRule: fieldsRule,
    };
  };

  setError = errMsg => {
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
