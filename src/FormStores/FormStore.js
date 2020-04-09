import {observable, action, decorate} from 'mobx';
import Validator from 'validatorjs';
import en from 'validatorjs/src/lang/en';

class FormStore {
  form;

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
  }

  registerValidationRule(ruleName, callback, validationMessage) {
    Validator.register(ruleName, callback, validationMessage);
  }

  // Public functions
  registerFormField(name, validateRule, initialValue = '') {
    this.form.fields[name] = {
      value: initialValue,
      error: false,
      rule: validateRule,
      changed: false,
    };
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
    return true;
  };

  // Determine if the form action button has to be disabled
  isFormActionDisabled = () => {
    return this.form.meta.formValidationMade ? !this.form.meta.isValid : false;
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

  getChangedFormFieldsJson = () => {
    let changedFieldsJson = {};

    for (const key in this.form.fields) {
      const formField = this.form.fields[key];
      if (formField.changed) {
        changedFieldsJson[key] = formField.value;
      }
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
