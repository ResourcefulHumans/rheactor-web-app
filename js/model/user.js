'use strict'

const _forEach = require('lodash/forEach')
const _create = require('lodash/create')
const Aggregate = require('./aggregate')

/**
 * @param {object} data
 * @constructor
 */
function User (data) {
  Aggregate.call(this)
  this.$id = undefined
  this.$version = undefined
  this.$links = undefined
  this.email = undefined
  this.firstname = undefined
  this.lastname = undefined
  this.avatar = undefined

  if (data) {
    var self = this
    _forEach(this, function (value, key) {
      self[key] = data[key] === undefined ? undefined : data[key]
    })
  }
  this.$context = User.$context
  this.name = [this.firstname, this.lastname].join(' ')
  this.$acceptedEvents = []
  this.$aggregateAlias = 'user'
}
User.prototype = _create(Aggregate.prototype, {
  'constructor': User
})

User.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#User'

module.exports = User
