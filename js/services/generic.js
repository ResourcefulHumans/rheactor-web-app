'use strict'

const HttpProblem = require('../model/http-problem')
const httpUtil = require('../util/http')
const _merge = require('lodash/merge')
const Promise = require('bluebird')
const ApplicationError = require('rheactor-value-objects/errors/application')
const jsonld = require('../util/jsonld')

/**
 * @param $http
 * @param {APIService} apiService
 * @param {String} modelContext
 * @constructor
 */
function GenericApiService ($http, apiService, modelContext) {
  this.$http = $http
  this.apiService = apiService
  this.modelContext = modelContext
}

/**
 * @param model
 * @param {String} expectedContext
 */
GenericApiService.prototype.validateModelContext = function (model, expectedContext) {
  let self = this
  expectedContext = expectedContext || self.modelContext
  if (expectedContext && model.$context !== expectedContext) {
    throw new ApplicationError('Unexpected model context! Got "' + model.$context + '", expected "' + self.modelContext + "'")
  }
}
/**
 * @param {String} endpoint
 * @param {Login} model
 * @param {JsonWebToken} token
 * @param {boolean} fetch Fetch the created model, defaults to true, if false returns the location header value if present
 * @returns {Promise.<Model|String>}
 */
GenericApiService.prototype.create = function (endpoint, model, token, fetch) {
  const self = this
  fetch = fetch !== false

  let header = httpUtil.accept(self.apiService.mimeType)
  if (token) {
    _merge(header, httpUtil.auth(token))
  }
  return self.$http.post(endpoint, model, header)
    .then(response => {
      if (response.data) {
        const model = self.apiService.createModelInstance(response.data)
        self.validateModelContext(model)
        return model
      }
      const location = response.headers('Location')
      if (location) {
        if (fetch) {
          return self.get(location, token)
        } else {
          return location
        }
      }
      return null
    })
    .catch(httpError => {
      throw HttpProblem.fromHttpError(httpError, 'Creation of ' + model.$context + ' failed!')
    })
}

/**
 * @param {String} $id
 * @param {JsonWebToken} token
 * @returns {Promise.<Model>}
 */
GenericApiService.prototype.get = function ($id, token) {
  let self = this
  let header = httpUtil.accept(self.apiService.mimeType)
  if (token) {
    _merge(header, httpUtil.auth(token))
  }
  return self.$http.get($id, header)
    .then(function (response) {
      if (response.data) {
        let model = self.apiService.createModelInstance(response.data)
        self.validateModelContext(model)
        return model
      }
      return null
    })
    .catch(function (err) {
      if (err.status) {
        throw HttpProblem.fromHttpError(err, 'Fetching of ' + $id + ' failed!')
      }
      throw HttpProblem.fromException(err, 500)
    })
}

/**
 * Fetch a list of items from the endpoint
 *
 * @param {String} endpoint
 * @param {Object} query
 * @param {JsonWebToken} token
 * @param {String} expectedContext
 * @returns {Promise.<Model>}
 */
GenericApiService.prototype.list = function (endpoint, query, token, expectedContext) {
  let self = this
  expectedContext = expectedContext || self.modelContext
  let header = httpUtil.accept(self.apiService.mimeType)
  if (token) {
    _merge(header, httpUtil.auth(token))
  }
  return self.$http.post(endpoint, query, header)
    .then(function (response) {
      if (response.data) {
        let model = self.apiService.createModelInstance(response.data)
        if (expectedContext) {
          return Promise
            .map(model.items, (model) => {
              self.validateModelContext(model, expectedContext)
            })
            .then(() => {
              return model
            })
        } else {
          return model
        }
      }
      return null
    })
    .catch((err) => {
      if (err.status) {
        throw HttpProblem.fromHttpError(err, 'Fetching of ' + endpoint + ' failed!')
      }
      throw HttpProblem.fromException(err, 500)
    })
}

/**
 * Follow the links in a list
 *
 * @param {List} list
 * @param {String} dir
 * @param {JsonWebToken} token
 * @return {Promise.<List>}
 */
GenericApiService.prototype.navigateList = function (list, dir, token) {
  let self = this
  return self.list(jsonld.getRelLink(dir, list), {}, token)
}

/**
 * Update a resource
 *
 * @param {String} endpoint
 * @param {Object} data
 * @param {Number} version
 * @param {JsonWebToken} token
 * @returns {Promise.<Model>}
 */
GenericApiService.prototype.update = function (endpoint, data, version, token) {
  let self = this
  let header = _merge(httpUtil.accept(self.apiService.mimeType), httpUtil.ifMatch(version), httpUtil.auth(token))
  return self.$http.put(endpoint, data, header)
    .catch((err) => {
      if (err.status) {
        throw HttpProblem.fromHttpError(err, 'Updating of ' + endpoint + ' failed!')
      }
      throw HttpProblem.fromException(err, 500)
    })
}

module.exports = GenericApiService
