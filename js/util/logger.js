'use strict'

/* global: window */

if (typeof window !== 'undefined' && window.navigator && window.navigator.userAgent &&
  (window.navigator.userAgent.indexOf('MSIE ') >= 0 || window.navigator.userAgent.indexOf('rv:11.0') > 0)) {
  module.exports = {
    appInfo: console.log.bind(console, '[App] '),
    appNotice: console.log.bind(console, '[App!] '),
    appWarning: console.log.bind(console, '[!!App!!] '),
    authInfo: console.log.bind(console, '[Auth] '),
    authNotice: console.log.bind(console, '[Auth!] '),
    authWarning: console.log.bind(console, '[!!Auth!!] '),
    apiInfo: console.log.bind(console, '[API] '),
    apiNotice: console.log.bind(console, '[API!] '),
    apiWarning: console.log.bind(console, '[!!API!!] ')
  }
} else {
  module.exports = {
    appInfo: console.log.bind(console, '%c App ', 'background: #3399ff; color: #fff'),
    appNotice: console.log.bind(console, '%c App ', 'background: #CC8F14; color: #fff'),
    appWarning: console.log.bind(console, '%c ⚠ App ⚠ ', 'background: #CC4B21; color: #fff'),
    authInfo: console.log.bind(console, '%c Auth ', 'background: #F2B646; color: #fff'),
    authNotice: console.log.bind(console, '%c Auth ', 'background: #CC8F14; color: #fff'),
    authWarning: console.log.bind(console, '%c ⚠ Auth ⚠ ', 'background: #CC4B21; color: #fff'),
    apiInfo: console.log.bind(console, '%c API ', 'background: #99FF33; color: #ccc'),
    apiNotice: console.log.bind(console, '%c API ', 'background: #CC8F14; color: #fff'),
    apiWarning: console.log.bind(console, '%c ⚠ API ⚠ ', 'background: #CC4B21; color: #fff')
  }
}
