'use strict'

/* global EventSource, trackJs */

const Promise = require('bluebird')
require('event-source-polyfill')
const logger = require('./logger')

function ModelEventConnection (streamUrl) {
  this.subscribers = []
  this.errorSubscribers = []
  this.streamUrl = streamUrl
}

/**
 * Connect to the stream
 *
 * @param {JsonWebToken} token
 * @return EventSource
 */
ModelEventConnection.prototype.connect = function (token) {
  let self = this
  if (self.source) {
    logger.appWarning('ModelEventConnection', 'already connected!')
    return self.source
  }
  self.source = new EventSource(self.streamUrl + '?token=' + token.token)
  self.source.onerror = (e) => {
    logger.appWarning('ModelEventConnection', 'failed to connect', e)
    Promise.map(self.errorSubscribers, (handler) => {
      return Promise
        .try(() => {
          handler(e)
        })
        .catch((err) => {
          logger.appWarning('ModelEventConnection', 'calling errorHandler failed', err)
        })
    })
  }
  self.source.addEventListener('ModelEvent', (ev) => {
    const event = JSON.parse(ev.data)
    if (event.name !== 'PingEvent') {
      logger.appInfo('ModelEventConnection', event.name, event)
    }
    Promise.map(self.subscribers, (handler) => {
      return Promise
        .try(() => {
          handler(event)
        })
        .catch((err) => {
          logger.appWarning('ModelEventConnection', 'Application of "' + event + '" failed', err)
          trackJs.track(err)
        })
    })
  })
  logger.appInfo('ModelEventConnection', 'connected to', self.streamUrl)
  return self.source
}

/**
 * @param {function} handler
 * @param {function} errorHandler
 */
ModelEventConnection.prototype.subscribe = function (handler, errorHandler) {
  let self = this
  self.subscribers.push(handler)
  if (errorHandler) self.errorSubscribers.push(errorHandler)
}

/**
 * Close the connection to the stream
 */
ModelEventConnection.prototype.disconnect = function () {
  let self = this
  if (self.source.readyState !== 1) {
    logger.appWarning('ModelEventConnection', 'not connected!')
    return
  }
  self.source.close()
  self.source = null
  logger.appInfo('ModelEventConnection', 'disconnected from', self.streamUrl)
}

ModelEventConnection.prototype.isConnected = function () {
  let self = this
  return !!self.source
}

/**
 * Retrieve the connection object
 * @return EventSource
 */
ModelEventConnection.prototype.getSource = function () {
  let self = this
  if (!self.source) {
    logger.appWarning('ModelEventConnection', 'not connected!')
    return
  }
  return self.source
}

module.exports = ModelEventConnection
