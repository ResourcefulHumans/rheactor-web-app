'use strict'

require('angular')
  .module('RHeactorDirectiveModule', [])
  .directive('bootstrapErrorStates', [() => {
    return require('./bootstrap-error-states')()
  }])
  .directive('autoFocus', ['$window', ($window) => {
    return require('./auto-focus')($window)
  }])
  .directive('isEmail', [() => {
    return require('./is-email')
  }])
  .directive('markdownToHtml', ['$location', '$sanitize', '$sce', ($location, $sanitize, $sce) => {
    return require('./markdown-to-html')($location, $sanitize, $sce)
  }])

