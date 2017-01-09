'use strict'

const Promise = require('bluebird')
const logger = require('../util/logger')
const EntryNotFoundError = require('rheactor-value-objects/errors/entry-not-found')
const TokenExpiredError = require('rheactor-value-objects/errors/token-expired')

/**
 * @param $window
 * @param $rootScope
 * @param {APIService} APIService
 * @returns {ClientStorageService}
 */
module.exports = function ($window, $rootScope, APIService) {
  function ClientStorageService () {
    var self = this
    self.getValidToken()
      .then((token) => {
        self.notify('token', token)
      })
      .then(() => {
        self.get('me')
          .then((token) => {
            self.notify('me', token)
          })
      })
      .catch(err => EntryNotFoundError.is(err), () => null)
  }

  /**
   * Store a value
   * @param {String} name
   * @param {Object} value
   * @returns {Promise}
   */
  ClientStorageService.prototype.set = function (name, value) {
    logger.appInfo('ClientStorageService.set', name)
    var self = this
    return Promise
      .try(function () {
        return $window.localStorage.setItem(name, JSON.stringify(value))
      })
      .then(function () {
        self.notify(name, value)
      })
  }

  /**
   * Retrieve a value
   * @param {String} name
   * @returns {Promise}
   */
  ClientStorageService.prototype.get = function (name) {
    return Promise
      .try(() => {
        let v = $window.localStorage.getItem(name)
        if (!v) {
          throw new EntryNotFoundError(name)
        }
        return APIService.createModelInstance(JSON.parse(v))
      })
  }

  /**
   * Remove a value
   * @param {String} name
   * @returns {Promise}
   */
  ClientStorageService.prototype.remove = function (name) {
    logger.appInfo('ClientStorageService.remove', name)
    var self = this
    return Promise
      .try(function () {
        return $window.localStorage.removeItem(name)
      })
      .then(function () {
        self.notify(name, undefined)
      })
  }

  ClientStorageService.prototype.subscribe = function (scope, callback) {
    var handler = $rootScope.$on('clientstorage-event', callback)
    scope.$on('$destroy', handler)
  }

  ClientStorageService.prototype.notify = function (name, value) {
    logger.appInfo('ClientStorageService.notify', name)
    $rootScope.$emit('clientstorage-event', name, value)
  }

  /**
   * Retrieves the token and checks that it is not expired
   * @returns {Promise.<JsonWebToken>}
   */
  ClientStorageService.prototype.getValidToken = function () {
    let self = this
    return self.get('token')
      .then((token) => {
        if (token.isExpired()) {
          logger.authWarning('Token expired')
          throw new TokenExpiredError(token)
        }
        return token
      })
  }

  return new ClientStorageService()
}
