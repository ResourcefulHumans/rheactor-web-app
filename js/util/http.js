'use strict'

/* global trackJs */

/**
 * @param {JsonWebToken} token
 * @returns {{headers: {Authorization: string}}}
 */
function auth (token) {
  return {
    headers: {
      Authorization: 'Bearer ' + token.token
    }
  }
}

/**
 * @param {String} mimeType
 */
function accept (mimeType) {
  return {
    headers: {
      Accept: mimeType,
      'Content-Type': mimeType + '; charset=utf-8'
    }
  }
}

function ifMatch (match) {
  return {
    headers: {
      'If-Match': match
    }
  }
}

function HttpProgress () {
  this.reset()
}

HttpProgress.prototype.activity = function () {
  this.$pristine = false
  this.$active = true
  this.$done = false
  this.$error = false
  this.$success = false
  this.$problem = null
  document.body.parentElement.style.cursor = 'wait'
  return this
}

/**
 * @param {HttpProgress} self
 * @param {boolean} error
 * @param {HttpProblem} httpProblem
 * @returns {HttpProgress}
 */
const done = function (self, error, httpProblem) {
  self.$pristine = false
  self.$active = false
  self.$done = true
  self.$error = error || false
  self.$success = !self.$error
  self.$problem = httpProblem && self.$error ? httpProblem : null
  document.body.parentElement.style.cursor = ''
  return self
}

/**
 * @param {HttpProblem} httpProblem
 */
HttpProgress.prototype.error = function (httpProblem) {
  trackJs.track(httpProblem)
  done(this, true, httpProblem)
}

HttpProgress.prototype.success = function () {
  done(this)
}

HttpProgress.prototype.reset = function () {
  this.$pristine = true
  this.$active = false
  this.$done = false
  this.$error = false
  this.$success = false
  this.$problem = null
}

module.exports = {
  auth,
  accept,
  ifMatch,
  HttpProgress
}
