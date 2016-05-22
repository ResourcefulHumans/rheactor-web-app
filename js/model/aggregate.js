'use strict'

/**
 * @constructor
 */
function Aggregate () {
  this.$id = undefined
  this.$version = undefined
  this.$links = undefined
  this.$acceptedEvents = undefined
  this.$aggregateAlias = undefined
  this.$deleted = false
  this.$createdAt = null
  this.$updatedAt = null
  this.$deletedAt = null
}

/**
 * @param {Number} updatedAt
 */
Aggregate.prototype.updated = function (updatedAt) {
  let self = this
  self.$version++
  self.$updatedAt = updatedAt || Date.now()
}

/**
 * @param {Number} deletedAt
 */
Aggregate.prototype.deleted = function (deletedAt) {
  let self = this
  self.$version++
  self.$deleted = true
  self.$deletedAt = deletedAt || Date.now()
}

/**
 * Returns whether the aggregate accepts the event of the given name
 *
 * @param {String} name
 * @return  {Boolean}
 */
Aggregate.prototype.accepts = function (name) {
  let self = this
  return self.$acceptedEvents.indexOf(name) > -1
}

module.exports = Aggregate
