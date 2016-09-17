'use strict'

const _create = require('lodash/create')
const GenericAPIService = require('../services/generic')
const jsonld = require('../util/jsonld')
const User = require('../model/user')

/**
 * @param $http
 * @param {APIService} apiService
 * @constructor
 */
function UserService ($http, apiService) {
  GenericAPIService.call(this, $http, apiService, User.$context)
}

UserService.prototype = _create(GenericAPIService.prototype, {
  'constructor': UserService
})

/**
 * @param {Object} filter
 * @param {JsonWebToken} token
 * @return {Promise.<appButton>}
 */
UserService.prototype.listUsers = function (filter, token) {
  const self = this
  return self.apiService.index().then(index => GenericAPIService.prototype.list.call(this, jsonld.getListLink(User.$context, index), filter, token))
}

/**
 * @param {User} user
 * @param {JsonWebToken} token
 * @return {Promise.<User>}
 */
UserService.prototype.create = function (user, token) {
  let self = this
  return self.apiService.index().then(index => GenericAPIService.prototype.create.call(self, jsonld.getRelLink('create-user', index), user, token))
}

/**
 * Activate a user (superusers only)
 * @param {User} user
 * @param {JsonWebToken} token
 * @return {Promise}
 */
UserService.prototype.activate = function (user, token) {
  let self = this
  return GenericAPIService.prototype.update
    .call(
      self,
      jsonld.getRelLink('toggle-active', user),
      {},
      user.$version,
      token
    )
    .then((response) => {
      let lastModified = new Date(response.headers('Last-Modified')).getTime()
      let version = +response.headers('etag')
      user.updated(lastModified, version)
      user.active = true
      return user
    })
}

/**
 * Deactivate a user (superusers only)
 * @param {User} user
 * @param {JsonWebToken} token
 * @return {Promise}
 */
UserService.prototype.deactivate = function (user, token) {
  let self = this
  return GenericAPIService.prototype.delete
    .call(
      self,
      jsonld.getRelLink('toggle-active', user),
      user.$version,
      token
    )
    .then((response) => {
      let lastModified = new Date(response.headers('Last-Modified')).getTime()
      let version = +response.headers('etag')
      user.updated(lastModified, version)
      user.active = false
      return user
    })
}

module.exports = UserService
