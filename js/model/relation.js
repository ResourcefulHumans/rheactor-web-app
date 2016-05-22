'use strict'

const _forEach = require('lodash/forEach')

/**
 * @param {object} data
 * @constructor
 */
function Relation (data) {
  this.context = undefined
  this.list = undefined
  this.href = undefined
  this.rel = undefined

  if (data) {
    var self = this
    _forEach(this, function (value, key) {
      self[key] = data[key] === undefined ? undefined : data[key]
    })
  }
  this.$context = Relation.$context
}

Relation.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#Relation'

module.exports = Relation
