'use strict'

const setErrorStates = (element, modelCtrl) => {
  const parent = element.parents('.form-group')
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

const resetErrorStates = (element) => {
  element.removeClass('form-control-danger')
  element.removeClass('form-control-success')
  const parent = element.parents('.form-group')
  if (parent) {
    parent.removeClass('has-danger')
    parent.removeClass('has-success')
  }
}

module.exports = {
  restrict: 'A',
  require: ['ngModel', '^form'],
  link: (scope, element, attrs, ctrls) => {
    const modelCtrl = ctrls[0]
    const formCtrl = ctrls[1]
    modelCtrl.$viewChangeListeners.push(() => {
      setErrorStates(element, modelCtrl)
    })
    modelCtrl.$parsers.push((viewValue) => {
      setErrorStates(element, modelCtrl)
      return viewValue
    })
    // watch for changes on the pristine state (form might get reset)
    // and reset the error states
    scope.$watch(formCtrl.$name + '.' + modelCtrl.$name + '.$pristine', (isPristine, wasPristine) => {
      if (!wasPristine && isPristine) {
        resetErrorStates(element)
      }
    })
  }
}
