'use strict'

const _create = require('lodash/create')
const GenericAPIService = require('../services/generic')
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

module.exports = UserService
