'use strict'

const _create = require('lodash/create')
const GenericAPIService = require('../services/generic')
const jsonld = require('../util/jsonld')
const Token = require('../model/jsonwebtoken')

/**
 * @param $http
 * @param {APIService} apiService
 * @constructor
 */
function TokenService ($http, apiService) {
  GenericAPIService.call(this, $http, apiService, Token.$context)
}

TokenService.prototype = _create(GenericAPIService.prototype, {
  'constructor': TokenService
})

/**
 * @param {JsonWebToken} token
 * @returns {Promise.<JsonWebToken>}
 */
TokenService.prototype.create = function (token) {
  return GenericAPIService.prototype.create.call(
    this,
    jsonld.getRelLink('token-renew', token),
    token,
    token
  )
}

module.exports = TokenService
