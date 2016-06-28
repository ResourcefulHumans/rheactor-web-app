'use strict'

const isEmail = require('isemail')

module.exports = {
  restrict: 'A',
  require: 'ngModel',
  link: function (scope, element, attrs, modelCtrl) {
    modelCtrl.$validators.isEmail = function (modelValue, viewValue) {
      if (!viewValue) {
        return true
      }
      return isEmail.validate(viewValue, {minDomainAtoms: 2})
    }
  }
}
