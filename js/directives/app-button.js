'use strict'

module.exports = {
  restrict: 'E',
  scope: {
    click: '=click',
    form: '=form',
    progress: '=progress',
    label: '@label',
    icon: '@icon',
    class: '@class'
  },
  templateUrl: '/directive/app-button.html',
  link: scope => {
    scope.isDisabled = () => {
      if (scope.form) {
        if (scope.form.$invalid) return true
        if (scope.form.$pristine) return true
      }
      return scope.progress.$active
    }
    scope.isPristine = () => {
      if (scope.isDisabled()) return false
      return !scope.progress.$active && scope.progress.$pristine
    }
    scope.isProgress = () => {
      return scope.progress.$active
    }
    scope.isSuccess = () => {
      return !scope.isProgress() && scope.progress.$success
    }
    scope.isError = () => {
      return !scope.isProgress() && scope.progress.$error
    }
  }
}
