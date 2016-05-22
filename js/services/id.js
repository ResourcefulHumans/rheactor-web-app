'use strict'

module.exports = function ($window) {
  return {
    encode: (str) => {
      return $window.btoa(encodeURI(encodeURIComponent(str)))
    },
    decode: (str) => {
      return decodeURIComponent(decodeURI($window.atob(str)))
    }
  }
}
