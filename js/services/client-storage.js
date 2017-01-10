import Promise from 'bluebird'
import {appLogger} from '../util/logger'
import {TokenExpiredError, EntryNotFoundError} from '@resourcefulhumans/rheactor-errors'

const logger = appLogger()

export class ClientStorageService {
  /**
   * @param $window
   * @param $rootScope
   * @param {APIService} APIService
   * @returns {ClientStorageService}
   */
  constructor ($window, $rootScope, APIService) {
    this.$window = $window
    this.$rootScope = $rootScope
    this.APIService = APIService
    this.getValidToken()
      .then((token) => {
        this.notify('token', token)
      })
      .then(() => {
        this.get('me')
          .then((token) => {
            this.notify('me', token)
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
  set (name, value) {
    logger.appInfo('ClientStorageService.set', name)
    return Promise
      .try(() => {
        return this.$window.localStorage.setItem(name, JSON.stringify(value))
      })
      .then(() => {
        this.notify(name, value)
      })
  }

  /**
   * Retrieve a value
   * @param {String} name
   * @returns {Promise}
   */
  get (name) {
    return Promise
      .try(() => {
        let v = this.$window.localStorage.getItem(name)
        if (!v) {
          throw new EntryNotFoundError(name)
        }
        return this.APIService.createModelInstance(JSON.parse(v))
      })
  }

  /**
   * Remove a value
   * @param {String} name
   * @returns {Promise}
   */
  remove (name) {
    logger.appInfo('ClientStorageService.remove', name)
    return Promise
      .try(() => {
        return this.$window.localStorage.removeItem(name)
      })
      .then(() => {
        this.notify(name, undefined)
      })
  }

  subscribe (scope, callback) {
    scope.$on('$destroy', this.$rootScope.$on('clientstorage-event', callback))
  }

  notify (name, value) {
    logger.appInfo('ClientStorageService.notify', name)
    this.$rootScope.$emit('clientstorage-event', name, value)
  }

  /**
   * Retrieves the token and checks that it is not expired
   * @returns {Promise.<JsonWebToken>}
   */
  getValidToken () {
    return this.get('token')
      .then((token) => {
        if (token.isExpired()) {
          logger.authWarning('Token expired')
          throw new TokenExpiredError(token)
        }
        return token
      })
  }
}
