'use strict'

const _filter = require('lodash/filter')

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
  this.hasNext = _filter(this.$links, link => link.rel === 'next').length > 0
  this.hasPrev = _filter(this.$links, link => link.rel === 'prev').length > 0
}

List.$context = 'https://github.com/RHeactor/nucleus/wiki/JsonLD#List'

module.exports = List
