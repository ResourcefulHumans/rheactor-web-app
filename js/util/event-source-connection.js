'use strict'

/* global EventSource, trackJs */

const Promise = require('bluebird')
require('event-source-polyfill')
const logger = require('./logger')

/**
 * @deprecated Use ModelEventConnection
 * @param {string} streamUrl
 * @param {string} eventName
 * @constructor
 */
function EventSourceConnection (streamUrl, eventName) {
  this.subscribers = []
  this.errorSubscribers = []
  this.streamUrl = streamUrl
  this.eventName = eventName
}

/**
 * Connect to the stream
 *
 * @param {JsonWebToken} token
 * @return EventSource
 */
EventSourceConnection.prototype.connect = function (token) {
  let self = this
  if (self.source) {
    logger.appWarning('EventSourceConnection', 'already connected!')
    return self.source
  }
  self.source = new EventSource(self.streamUrl + '?token=' + token.token)
  self.source.onerror = (e) => {
    // TODO: log
    logger.appWarning('EventSourceConnection', 'failed to connect', e)
    Promise.map(self.errorSubscribers, (handler) => {
      return Promise
        .try(() => {
          handler(e)
        })
        .catch((err) => {
          logger.appWarning('EventSourceConnection', 'calling errorHandler failed', err)
        })
    })
  }
  self.source.addEventListener(self.eventName, (ev) => {
    let data = JSON.parse(ev.data)
    let event = data.event
    let eventCreatedAt = data.eventCreatedAt
    let payload = data.payload
    if (event !== 'Ping') {
      logger.appInfo('EventSourceConnection', self.eventName, '>', event, payload)
    }
    Promise.map(self.subscribers, (handler) => {
      return Promise
        .try(() => {
          handler(event, eventCreatedAt, payload)
        })
        .catch((err) => {
          logger.appWarning('EventSourceConnection', 'Application of "' + event + '" failed', err)
          trackJs.track(err)
        })
    })
  })
  logger.appInfo('EventSourceConnection', 'connected to', self.streamUrl)
  return self.source
}

/**
 * @param {function} handler
 */
EventSourceConnection.prototype.subscribe = function (handler, errorHandler) {
  let self = this
  self.subscribers.push(handler)
  if (errorHandler) self.errorSubscribers.push(errorHandler)
}

/**
 * Close the connection to the stream
 */
EventSourceConnection.prototype.disconnect = function () {
  let self = this
  if (self.source.readyState !== 1) {
    logger.appWarning('EventSourceConnection', 'not connected!')
    return
  }
  self.source.close()
  self.source = null
  logger.appInfo('EventSourceConnection', 'disconnected from', self.streamUrl)
}

EventSourceConnection.prototype.isConnected = function () {
  let self = this
  return !!self.source
}

/**
 * Retrieve the connection object
 * @return EventSource
 */
EventSourceConnection.prototype.getSource = function () {
  let self = this
  if (!self.source) {
    logger.appWarning('EventSourceConnection', 'not connected!')
    return
  }
  return self.source
}

module.exports = EventSourceConnection
