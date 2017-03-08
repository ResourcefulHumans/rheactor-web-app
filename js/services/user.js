import {GenericAPIService} from '../services/generic'
import {User} from 'rheactor-models'
import {JSONLD} from '../util/jsonld'

export class UserService extends GenericAPIService {
  /**
   * @param $http
   * @param {APIService} apiService
   **/
  constructor ($http, apiService) {
    super($http, apiService, User.$context)
  }

  /**
   * @param {Object} filter
   * @param {JsonWebToken} token
   * @return {Promise.<appButton>}
   */
  listUsers (filter, token) {
    return this.apiService.index().then(index => this.list(JSONLD.getListLink(User.$context, index), filter, token))
  }

  /**
   * @param {User} user
   * @param {JsonWebToken} token
   * @return {Promise.<User>}
   */
  create (user, token) {
    return this.apiService.index().then(index => this.list(JSONLD.getRelLink('create-user', index), user, token))
  }

  /**
   * Activate a user (superusers only)
   * @param {User} user
   * @param {JsonWebToken} token
   * @return {Promise}
   */
  activate (user, token) {
    return this.update(JSONLD.getRelLink('toggle-active', user), {}, user.$version, token)
      .then((response) => {
        let lastModified = new Date(response.headers('Last-Modified'))
        let version = +response.headers('etag')
        user.active = true
        return user.updated(lastModified, version)
      })
  }

  /**
   * Deactivate a user (superusers only)
   * @param {User} user
   * @param {JsonWebToken} token
   * @return {Promise}
   */
  deactivate (user, token) {
    return this.delete(JSONLD.getRelLink('toggle-active', user), user.$version, token)
      .then((response) => {
        let lastModified = new Date(response.headers('Last-Modified'))
        let version = +response.headers('etag')
        user.active = false
        return user.updated(lastModified, version)
      })
  }

  /**
   * Update a user property
   *
   * @param {User} user
   * @param {String} property
   * @param {object} value
   * @param {JsonWebToken} token
   * @return {Promise}
   */
  updateProperty (user, property, value, token) {
    return this.update(JSONLD.getRelLink('update-' + property, user), {value}, user.$version, token)
      .then((response) => {
        let lastModified = new Date(response.headers('Last-Modified'))
        let version = +response.headers('etag')
        user[property] = value
        return user.updated(lastModified, version)
      })
  }

  /**
   * Update the user's preferences
   *
   * @param {User} user
   * @param {String} preferences
   * @param {JsonWebToken} token
   * @return {Promise}
   */
  updatePreferences (user, preferences, token) {
    return this.update(JSONLD.getRelLink('update-preferences', user), {value: preferences}, user.$version, token)
      .then(() => {
        let lastModified = new Date()
        let version = user.$version++
        user.preferences = preferences
        return user.updated(lastModified, version)
      })
  }

  /**
   * User requests and email change
   *
   * @param {User} user
   * @param {String} newEmail
   * @param {JsonWebToken} token
   * @return {Promise}
   */
  requestEmailChange (user, newEmail, token) {
    return this.update(JSONLD.getRelLink('change-email', user), {value: newEmail}, user.$version, token)
  }

  /**
   * Confirm an email change
   *
   * @param {User} user
   * @param {JsonWebToken} confirmationToken
   * @return {Promise}
   */
  confirmEmailChange (user, confirmationToken) {
    return this.update(JSONLD.getRelLink('change-email-confirm', user), {}, user.$version, confirmationToken)
  }
}
