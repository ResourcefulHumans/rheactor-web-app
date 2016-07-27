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
 * @return {Promise.<List>}
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

module.exports = UserService
