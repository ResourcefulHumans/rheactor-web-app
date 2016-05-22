'use strict'

module.exports = function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      $window.setTimeout(function () {
        element[0].focus()
      }, 0)
    }
  }
}
