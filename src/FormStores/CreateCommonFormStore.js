import FormStore from './FormStore';
import CreateCommonForm from '../Components/Forms/CreateCommonForm';

class CreateCommonFormStore extends FormStore {
  constructor() {
    super();
  }
  getChangedFormFieldsJson = () => {
    let changedFieldsJson = {};

    let titles = [];
    let body = [];
    for (const key in this.form.fields) {
      const formField = this.form.fields[key];

      const links = CreateCommonForm.LINKS;
      if (key.startsWith(links)) {
        if (!changedFieldsJson[links]) {
          changedFieldsJson[links] = [];
        }
        if (formField.value.length > 0) {
          changedFieldsJson[links] = changedFieldsJson[links].concat(
            formField.value,
          );
        }
        continue;
      }

      if (key.startsWith('ruleTitles')) {
        // console.log(key, formField.value);
        titles = titles.concat(formField.value);
        // console.log(titles);
        continue;
      }

      if (key.startsWith('ruleBody')) {
        // console.log(key, formField.value);
        body = body.concat(formField.value);
        continue;
      }

      if (formField.changed) {
        changedFieldsJson[key] = formField.value;
      }
    }

    if (titles.length > 0) {
      changedFieldsJson[CreateCommonForm.RULES] = [...titles.keys()].map(x => {
        return {title: titles[x], description: body[x]};
      });
    } else {
      changedFieldsJson[CreateCommonForm.RULES] = [];
    }

    return changedFieldsJson;
  };

  isFormValidSelectedFields = fields => {
    var validation = this.getValidator();
    this.form.meta.isValid = validation.passes();
    // console.log(validation.errors.errors);
    for (const key in fields) {
      const field = fields[key];
      if (validation.errors.first(field)) {
        return false;
      }
    }
    return true;
  };
}
export default CreateCommonFormStore;
