import {HttpProgress} from '../util/http'

export const AppButtonDirective = {
  restrict: 'E',
  scope: {
    click: '=',
    clickArgument: '=?',
    clickBindThis: '=?',
    form: '=?',
    progress: '=?',
    label: '@',
    icon: '@',
    class: '@buttonClass'
  },
  templateUrl: '/directive/app-button.html',
  link: scope => {
    if (!scope.progress) {
      scope.progress = new HttpProgress()
    }
    if (!scope.clickBindThis) scope.clickBindThis = scope
    scope.isDisabled = () => {
      if (scope.form) {
        if (scope.form.$invalid) return true
        if (scope.form.$pristine) return true
      }
      return scope.progress.$active
    }
    scope.isBlocked = () => {
      if (scope.progress.$active) return false
      return scope.isDisabled()
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
    scope.executeClick = () => {
      scope.click.call(scope.clickBindThis, scope.progress, scope.clickArgument)
    }
  }
}
