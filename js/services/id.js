export function IDservice ($window) {
  return {
    encode: (str) => {
      return $window.btoa(encodeURI(encodeURIComponent(str)))
    },
    decode: (str) => {
      return decodeURIComponent(decodeURI($window.atob(str)))
    }
  }
}
