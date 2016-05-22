'use strict'

const _forEach = require('lodash/forEach')

/**
 * @param {object} data
 * @constructor
 */
function PasswordChangeConfirm (data) {
  this.password = undefined

  if (data) {
    var self = this
    _forEach(this, function (value, key) {
      self[key] = data[key] === undefined ? undefined : data[key]
    })
  }

  this.$context = PasswordChangeConfirm.$context
}

PasswordChangeConfirm.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#PasswordChangeConfirm'

module.exports = PasswordChangeConfirm
