/* global EventSource, trackJs */

import Promise from 'bluebird'
import 'event-source-polyfill'
import {appLogger} from './logger'

const logger = appLogger()

/**
 * @deprecated Use ModelEventConnection
 */
export class EventSourceConnection {
  /**
   * @param {string} streamUrl
   * @param {string} eventName */
  constructor (streamUrl, eventName) {
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
  connect (token) {
    if (this.source) {
      logger.appWarning('EventSourceConnection', 'already connected!')
      return this.source
    }
    this.source = new EventSource(this.streamUrl + '?token=' + token.token)
    this.source.onerror = (e) => {
      // TODO: log
      logger.appWarning('EventSourceConnection', 'failed to connect', e)
      Promise.map(this.errorSubscribers, (handler) => {
        return Promise
          .try(() => {
            handler(e)
          })
          .catch((err) => {
            logger.appWarning('EventSourceConnection', 'calling errorHandler failed', err)
          })
      })
    }
    this.source.addEventListener(this.eventName, (ev) => {
      let data = JSON.parse(ev.data)
      let event = data.event
      let eventCreatedAt = data.eventCreatedAt
      let payload = data.payload
      if (event !== 'Ping') {
        logger.appInfo('EventSourceConnection', this.eventName, '>', event, payload)
      }
      Promise.map(this.subscribers, (handler) => {
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
    logger.appInfo('EventSourceConnection', 'connected to', this.streamUrl)
    return this.source
  }

  /**
   * @param {function} handler
   * @param {function} errorHandler
   */
  subscribe (handler, errorHandler) {
    this.subscribers.push(handler)
    if (errorHandler) this.errorSubscribers.push(errorHandler)
  }

  /**
   * Close the connection to the stream
   */
  disconnect () {
    if (this.source.readyState !== 1) {
      logger.appWarning('EventSourceConnection', 'not connected!')
      return
    }
    this.source.close()
    this.source = null
    logger.appInfo('EventSourceConnection', 'disconnected from', this.streamUrl)
  }

  isConnected () {
    return !!this.source
  }

  /**
   * Retrieve the connection object
   * @return EventSource
   */
  getSource () {
    if (!this.source) {
      logger.appWarning('EventSourceConnection', 'not connected!')
    }
    return this.source
  }
}
