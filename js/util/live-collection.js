/* global trackJs */

import logger from './logger'
import Promise from 'bluebird'

export class LiveCollection {
  /**
   * A live collection listens to events from the EventSourceConnection and applies those to the items the collections
   * contains. If an item has been updated it notifies its subscribers.
   *
   * @param {Array.<Aggregate>} items
   * @param {EventSourceConnection} esc
   * @constructor
   */
  constructor (items, esc) {
    this.items = items
    this.subscribers = []
    if (!esc) {
      throw new Error('No EventSourceConnection provided')
    }
    esc.subscribe(this.handleEvent.bind(this))
  }

  handleEvent (name, eventCreatedAt, event) {
    return Promise.map(this.items, (item) => {
      if (
        event[item.$context.toString()] &&
        event[item.$context.toString()].$context.toString() === item.$context.toString() &&
        event[item.$context.toString()].$id.toString() === item.$id.toString() &&
        event[item.$context.toString()].$version > item.$version // TODO: check if this is a good decision
      ) {
        let oldVersion = item.$version
        let method = 'apply' + name
        return Promise
          .try(() => {
            if (!(method in item)) {
              throw new Error(`${item.$context} has no method ${method}!`)
            }
            item[method](event, eventCreatedAt)
          })
          .then(() => {
            if (item.$version === oldVersion) return
            if (item.$deleted) {
              this.items.splice(this.items.indexOf(item), 1)
            }
            this.updated(item, event)
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
  updated (updatedItem, event) {
    return Promise.map(this.subscribers, (subscriber) => {
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
  contains (item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].$id.toString() === item.$id.toString()) return true
    }
    return false
  }

  /**
   * Removes the given item from the collection
   *
   * @param item
   * @return boolean
   */
  remove (item) {
    let index = this.items.indexOf(item)
    if (index < 0) {
      return false
    }
    this.items.splice(this.items.indexOf(item), 1)
    return true
  }

  /**
   * Add the given item to the collection
   *
   * @param item
   */
  add (item) {
    this.items.push(item)
  }

  /**
   * @param {function} subscriber
   */
  subscribe (subscriber) {
    this.subscribers.push(subscriber)
  }
}
