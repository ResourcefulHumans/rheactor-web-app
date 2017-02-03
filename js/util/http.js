/* global trackJs, document */

import {appLogger} from './logger'

const logger = appLogger()

/**
 * @param {JsonWebToken} token
 * @returns {{headers: {Authorization: string}}}
 */
export function auth (token) {
  return {
    headers: {
      Authorization: 'Bearer ' + token.token
    }
  }
}

/**
 * @param {String} mimeType
 */
export function accept (mimeType) {
  return {
    headers: {
      Accept: mimeType,
      'Content-Type': mimeType + '; charset=utf-8'
    }
  }
}

export function ifMatch (match) {
  return {
    headers: {
      'If-Match': match
    }
  }
}

/**
 * @param {HttpProgress} self
 * @param {boolean} error
 * @param {HttpProblem} httpProblem
 * @returns {HttpProgress}
 */
const done = (self, error, httpProblem) => {
  self.$pristine = false
  self.$active = false
  self.$done = true
  self.$error = error || false
  self.$success = !self.$error
  self.$problem = httpProblem && self.$error ? httpProblem : null
  if (typeof document !== 'undefined') document.body.parentElement.style.cursor = ''
  return self
}

export class HttpProgress {
  constructor (log) {
    this.log = log || logger.appWarning
    this.reset()
  }

  activity () {
    this.$pristine = false
    this.$active = true
    this.$done = false
    this.$error = false
    this.$success = false
    this.$problem = null
    if (typeof document !== 'undefined') document.body.parentElement.style.cursor = 'wait'
    return this
  }

  /**
   * @param {HttpProblem} httpProblem
   * @returns {HttpProgress}
   */
  error (httpProblem) {
    if (typeof trackJs !== 'undefined') trackJs.track(httpProblem)
    this.log(httpProblem)
    return done(this, true, httpProblem)
  }

  /**
   * @returns {HttpProgress}
   */
  success () {
    return done(this)
  }

  reset () {
    this.$pristine = true
    this.$active = false
    this.$done = false
    this.$error = false
    this.$success = false
    this.$problem = null
  }
}

