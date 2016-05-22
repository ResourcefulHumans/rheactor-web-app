'use strict'

function setErrorStates (element, modelCtrl) {
  let parent = element.parent('.form-group')
  if (modelCtrl.$valid) {
    element.addClass('form-control-success')
    element.removeClass('form-control-danger')
    if (parent) {
      parent.addClass('has-success')
      parent.removeClass('has-danger')
    }
  } else {
    element.addClass('form-control-danger')
    element.removeClass('form-control-success')
    if (parent && modelCtrl.$dirty) {
      parent.addClass('has-danger')
      parent.removeClass('has-success')
    }
  }
}

module.exports = function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$viewChangeListeners.push(() => {
        setErrorStates(element, modelCtrl)
      })
      modelCtrl.$parsers.push((viewValue) => {
        setErrorStates(element, modelCtrl)
        return viewValue
      })
    }
  }
}
