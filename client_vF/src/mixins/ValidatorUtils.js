export default {
  methods: {
    addError(field, isValid, errorMessage, obj) {
      obj[field] = Object.assign({}, obj[field], {
        isValid: isValid,
        errorMessage: errorMessage,
      });
    },
    removeError(field, obj) {
      for (const property in obj) {
        if (field == property) {
          obj[property] = {};
        }
      }
    },
    removeErrors(obj) {
      for (const property in obj) {
        obj[property] = {};
      }
    },
    hasErrors(obj) {
      for (const property in obj) {
        if (Object.keys(obj[property]).length !== 0) {
          return true;
        }
      }
      return false;
    },
  },
};
