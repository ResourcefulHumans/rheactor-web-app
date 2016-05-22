'use strict'

const appName = process.env.npm_package_name

module.exports = {
  appInfo: console.log.bind(console, '%c ' + appName + ' ', 'background: #3399ff; color: #fff'),
  appNotice: console.log.bind(console, '%c ' + appName + ' ', 'background: #CC8F14; color: #fff'),
  appWarning: console.log.bind(console, '%c ⚠ ' + appName + ' ⚠ ', 'background: #CC4B21; color: #fff'),
  authInfo: console.log.bind(console, '%c Auth ', 'background: #F2B646; color: #fff'),
  authNotice: console.log.bind(console, '%c Auth ', 'background: #CC8F14; color: #fff'),
  authWarning: console.log.bind(console, '%c ⚠ Auth ⚠ ', 'background: #CC4B21; color: #fff'),
  apiInfo: console.log.bind(console, '%c API ', 'background: #99FF33; color: #ccc'),
  apiNotice: console.log.bind(console, '%c API ', 'background: #CC8F14; color: #fff'),
  apiWarning: console.log.bind(console, '%c ⚠ API ⚠ ', 'background: #CC4B21; color: #fff')
}
