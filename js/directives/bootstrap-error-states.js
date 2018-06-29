const setErrorStates = (element, modelCtrl) => {
  if (modelCtrl.$valid) {
    element.addClass('is-valid')
    element.removeClass('is-invalid')
  } else {
    element.addClass('is-invalid')
    element.removeClass('is-valid')
  }
}

const resetErrorStates = (element) => {
  element.removeClass('is-invalid')
  element.removeClass('is-valid')
}

export const BootstrapErrorStatesDirective = {
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
    if (modelCtrl.$name) { // can be empty on textareas
      scope.$watch(formCtrl.$name + '.' + modelCtrl.$name + '.$pristine', (isPristine, wasPristine) => {
        if (!wasPristine && isPristine) {
          resetErrorStates(element)
        }
      })
    }
  }
}
