'use strict'

/* global trackJs */

const logger = require('./logger')
const Promise = require('bluebird')

/**
 * A live collection listens to events from the EventSourceConnection and applies those to the items the collections
 * contains. If an item has been updated it notifies its subscribers.
 *
 * @param {Array.<Aggregate>} items
 * @param {EventSourceConnection} esc
 * @constructor
 */
function LiveCollection (items, esc) {
  this.items = items
  this.subscribers = []
  if (!esc) {
    throw new Error('No EventSourceConnection provided')
  }
  esc.subscribe(this.handleEvent.bind(this))
}

LiveCollection.prototype.handleEvent = function (name, eventCreatedAt, event) {
  let self = this
  return Promise.map(self.items, (item) => {
    if (
      item.accepts(name) &&
      event[item.$aggregateAlias] &&
      event[item.$aggregateAlias].$context === item.$context &&
      event[item.$aggregateAlias].$id === item.$id &&
      event[item.$aggregateAlias].$version > item.$version // TODO: check if this is a good decision
    ) {
      let oldVersion = item.$version
      let method = 'apply' + name
      return Promise
        .try(() => {
          item[method](event, eventCreatedAt)
        })
        .then(() => {
          if (item.$version === oldVersion) return
          if (item.$deleted) {
            self.items.splice(self.items.indexOf(item), 1)
          }
          self.updated(item, event)
        })
        .catch((err) => {
          logger.appWarning('LiveCollection', 'Application of "' + name + '" failed', err)
          trackJs.track(err)
        })
    }
  })
}

/**
 * Notifies the subscribers about an updated item in this collection
 *
 * @param updatedItem
 * @param event
 */
LiveCollection.prototype.updated = function (updatedItem, event) {
  let self = this
  return Promise.map(self.subscribers, (subscriber) => {
    return Promise
      .try(() => {
        subscriber(updatedItem, event)
      })
      .catch((err) => {
        logger.appWarning('LiveCollection', 'Notifying subscriber failed', err)
        trackJs.track(err)
      })
  })
}

/**
 * Returns whether the collection contains the given item
 *
 * @param item
 * @return boolean
 */
LiveCollection.prototype.contains = function (item) {
  let self = this
  for (let i = 0; i < self.items.length; i++) {
    if (self.items[i].$id === item.$id) return true
  }
  return false
}

/**
 * Removes the given item from the collection
 *
 * @param item
 * @return boolean
 */
LiveCollection.prototype.remove = function (item) {
  let self = this
  let index = self.items.indexOf(item)
  if (index < 0) {
    return false
  }
  self.items.splice(self.items.indexOf(item), 1)
  return true
}

/**
 * @param {function} subscriber
 */
LiveCollection.prototype.subscribe = function (subscriber) {
  let self = this
  self.subscribers.push(subscriber)
}

module.exports = LiveCollection
