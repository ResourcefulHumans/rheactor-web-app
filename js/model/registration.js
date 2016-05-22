'use strict'

const _forEach = require('lodash/forEach')

/**
 * @param {object} data
 * @constructor
 */
function Login (data) {
  this.email = undefined
  this.password = undefined
  this.firstname = undefined
  this.lastname = undefined

  if (data) {
    var self = this
    _forEach(this, function (value, key) {
      self[key] = data[key] === undefined ? undefined : data[key]
    })
  }

  this.$context = Login.$context
}

Login.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#Login'

module.exports = Login
