'use strict'

const _create = require('lodash/create')
const GenericAPIService = require('./generic')
const Status = require('../model/status')
const jsonld = require('../util/jsonld')

/**
 * @param $http
 * @param {APIService} apiService
 * @constructor
 */
function StatusService ($http, apiService) {
  GenericAPIService.call(this, $http, apiService, Status.$context)
}

StatusService.prototype = _create(GenericAPIService.prototype, {
  'constructor': StatusService
})

/**
 * @return {Status}
 */
StatusService.prototype.status = function () {
  let self = this
  return self.apiService
    .index()
    .then((index) => {
      return GenericAPIService.prototype.get.call(self, jsonld.getRelLink('status', index) + '?t=' + Date.now())
    })
}

module.exports = StatusService
