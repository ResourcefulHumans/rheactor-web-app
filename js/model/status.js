'use strict'

const _forEach = require('lodash/forEach')

/**
 * @param {object} data
 * @constructor
 */
function Status (data) {
  this.status = undefined
  this.environment = undefined
  this.version = undefined
  this.age = undefined

  if (data) {
    var self = this
    _forEach(this, function (value, key) {
      self[key] = data[key] === undefined ? undefined : data[key]
    })
  }
  this.$context = Status.$context
}

Status.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#Status'

module.exports = Status
