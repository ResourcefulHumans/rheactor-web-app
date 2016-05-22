'use strict'

function HttpError (response) {
  this.name = 'HttpError'
  this.status = response.status
  this.statusText = response.status !== -1 ? response.statusText : 'Connection failed' // -1 is status code if connection failed
  this.headers = response.headers()
  this.method = response.config.method
  this.url = response.config.url
}
HttpError.prototype = Object.create(Error.prototype)
HttpError.prototype.constructor = HttpError
HttpError.prototype.toString = function () {
  return this.method + ' ' + this.url + ': ' + this.status + ' (' + this.statusText + ')'
}

module.exports = HttpError
