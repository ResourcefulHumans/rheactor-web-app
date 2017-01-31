import {String as StringType} from 'tcomb'
import {URIValue, URIValueType} from 'rheactor-value-objects'

const schemeAndHost = /^(https?:\/\/[^/]+)/

export class IDService {
  constructor ($window, $location) {
    this.$window = $window
    this.$location = $location
  }

  /**
   * @param {String} str
   * @returns {String}
   */
  encode (str) {
    StringType(str, ['IDService.encode', 'str:String'])
    return this.$window.btoa(encodeURI(encodeURIComponent(str)))
  }

  /**
   * @param {URIValue} uri
   * @returns {String}
   */
  encodeURI (uri) {
    URIValueType(uri, ['IDService.encodeURI', 'uri:URIValue'])
    return this.encode(uri.toString().replace(this.$location.absUrl().match(schemeAndHost)[1], ''))
  }

  /**
   * @param {String} str
   * @returns {String}
   */
  decode (str) {
    StringType(str, ['IDService.decode', 'str:String'])
    return decodeURIComponent(decodeURI(this.$window.atob(str)))
  }

  /**
   * @param {String} str
   * @returns {URIValue}
   */
  decodeURI (str) {
    StringType(str, ['IDService.decodeURI', 'str:String'])
    const decoded = this.decode(str)
    if (!schemeAndHost.test(decoded)) return new URIValue(this.$location.absUrl().match(schemeAndHost)[1] + decoded)
    return new URIValue(decoded)
  }
}
