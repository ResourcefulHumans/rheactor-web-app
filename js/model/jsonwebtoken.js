'use strict'

const _forEach = require('lodash/forEach')

if (!atob) {
  var atob = function (str) {
    return new Buffer(str, 'base64').toString('binary')
  }
}

/**
 * @param {object} token
 * @param {Array} $links
 * @constructor
 */
function JsonWebToken (token, $links) {
  this.iss = undefined // Issuer
  this.sub = undefined // Subject
  this.aud = undefined // Audience
  this.exp = undefined // Expiration Time
  this.nbf = undefined // Not Before
  this.iat = undefined // Issued At
  this.jti = undefined // JWT ID

  var data = JSON.parse(atob(token.split('.')[1]))
  if (data) {
    var self = this
    _forEach(this, function (value, key) {
      self[key] = data[key] || undefined
      delete data[key]
    })
    if (this.exp) {
      this.exp = new Date(this.exp * 1000)
    }
    if (this.nbf) {
      this.nbf = new Date(this.nbf * 1000)
    }
    if (this.iat) {
      this.iat = new Date(this.iat * 1000)
    }
    this.$links = $links || []
    // Store remaining data
    this.payload = data
  }

  this.$context = JsonWebToken.$context
  this.token = token || undefined
}

JsonWebToken.$context = 'https://tools.ietf.org/html/rfc7519'

JsonWebToken.prototype.isExpired = function () {
  return this.exp.getTime() < Date.now()
}

module.exports = JsonWebToken
