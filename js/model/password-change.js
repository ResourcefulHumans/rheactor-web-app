'use strict'

const _forEach = require('lodash/forEach')

/**
 * @param {object} data
 * @constructor
 */
function PasswordChange (data) {
  this.email = undefined

  if (data) {
    var self = this
    _forEach(this, function (value, key) {
      self[key] = data[key] === undefined ? undefined : data[key]
    })
  }

  this.$context = PasswordChange.$context
}

PasswordChange.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#PasswordChange'

module.exports = PasswordChange
