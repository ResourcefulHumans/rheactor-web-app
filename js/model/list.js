'use strict'

/**
 * @param {String} context of items
 * @param {Array} items
 * @param {Number} total
 * @param {Number} offset
 * @param {Number} itemsPerPage
 * @param {Array.<Relation>} links
 * @constructor
 */
function List (context, items, total, offset, itemsPerPage, links) {
  this.context = context
  this.items = items
  this.total = total
  this.offset = offset || 0
  this.itemsPerPage = itemsPerPage
  this.$context = List.$context
  this.$links = links || []
  this.from = offset + 1
  this.to = this.from + items.length - 1
  this.hasNext = this.total > this.to
  this.hasPrev = offset > 0
}

List.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#List'

module.exports = List
