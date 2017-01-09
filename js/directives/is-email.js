'use strict'

const EmailValue = require('rheactor-value-objects/email')

module.exports = {
  restrict: 'A',
  require: 'ngModel',
  link: function (scope, element, attrs, modelCtrl) {
    modelCtrl.$validators.isEmail = function (modelValue, viewValue) {
      if (!viewValue) {
        return true
      }
      try {
        return (new EmailValue(viewValue)) && true
      } catch (err) {
        return false
      }
    }
  }
}
