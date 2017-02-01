import {httpProblemfromHttpError} from '../util/http-problem'
import {auth, accept, ifMatch} from '../util/http'
import _merge from 'lodash/merge'
import Promise from 'bluebird'
import {ApplicationError} from '@resourcefulhumans/rheactor-errors'
import {JSONLD} from '../util/jsonld'
import {URIValue, URIValueType, MaybeURIValueType} from 'rheactor-value-objects'
import {ModelType, ListType, VersionNumberType, JsonWebTokenType, MaybeJsonWebTokenType} from 'rheactor-models'
import {String as StringType, Function as FunctionType, struct} from 'tcomb'

export const APIServiceType = struct({
  mimeType: StringType,
  createModelInstance: FunctionType,
  index: FunctionType
}, 'APIServiceType')

export class GenericAPIService {
  /**
   * @param $http
   * @param {APIService} apiService
   * @param {URIValue} modelContext
   */
  constructor ($http, apiService, modelContext) {
    FunctionType($http, ['GenericAPIService', '$http:Function'])
    APIServiceType(apiService, ['GenericAPIService', 'apiService:APIService'])
    URIValueType(modelContext, ['GenericAPIService', 'modelContext:URIValue'])
    this.$http = $http
    this.apiService = apiService
    this.modelContext = modelContext
  }

  /**
   * @param model
   * @param {URIValue} expectedContext
   */
  validateModelContext (model, expectedContext) {
    ModelType(model, ['GenericAPIService.validateModelContext', 'model:Model'])
    MaybeURIValueType(expectedContext, ['GenericAPIService.validateModelContext', 'expectedContext:?URIValue'])
    expectedContext = expectedContext || this.modelContext
    if (expectedContext && !expectedContext.toString() === model.$context.toString()) {
      throw new ApplicationError('Unexpected model context! Got "' + model.$context + '", expected "' + expectedContext + "'")
    }
  }

  /**
   * @param {URIValue} endpoint
   * @param {Model} model
   * @param {JsonWebToken} token
   * @param {boolean} fetch Fetch the created model, defaults to true, if false returns the location header value if present
   * @returns {Promise.<Model|String>}
   */
  create (endpoint, model, token, fetch) {
    URIValueType(endpoint, ['GenericAPIService.create', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericAPIService.create', 'token:?JsonWebToken'])
    fetch = fetch !== false

    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.post(endpoint.toString(), model, header)
      .then(response => {
        if (response.data) {
          const model = this.apiService.createModelInstance(response.data)
          this.validateModelContext(model)
          return model
        }
        const location = response.headers('Location')
        if (location) {
          if (fetch) {
            return this.get(new URIValue(location), token)
          } else {
            return location
          }
        }
        return null
      })
      .catch(err => err.status, httpError => {
        throw httpProblemfromHttpError(httpError, 'Creation of ' + model.$context + ' failed!')
      })
  }

  /**
   * @param {URIValue} endpoint
   * @param {object} query
   * @param {JsonWebToken} token
   * @returns {Promise.<Model|null>}
   */
  query (endpoint, query, token) {
    URIValueType(endpoint, ['GenericAPIService.query', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericAPIService.query', 'token:?JsonWebToken'])
    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.post(endpoint.toString(), query, header)
      .then(response => {
        if (!response.data) return null
        const model = this.apiService.createModelInstance(response.data)
        this.validateModelContext(model)
        return model
      })
      .catch(err => err.status, httpError => {
        throw httpProblemfromHttpError(httpError, 'Query to ' + endpoint + ' failed!')
      })
  }

  /**
   * @param {URIValue} endpoint
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  get (endpoint, token) {
    URIValueType(endpoint, ['GenericAPIService.get', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericAPIService.get', 'token:?JsonWebToken'])
    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.get(endpoint.toString(), header)
      .then(response => {
        if (response.data) {
          let model = this.apiService.createModelInstance(response.data)
          this.validateModelContext(model)
          return model
        }
        return null
      })
      .catch(err => err.status, err => {
        throw httpProblemfromHttpError(err, 'Fetching of ' + endpoint + ' failed!')
      })
  }

  /**
   * Fetch a list of items from the endpoint
   *
   * @param {URIValue} endpoint
   * @param {Object} query
   * @param {JsonWebToken} token
   * @param {String} expectedContext
   * @returns {Promise.<Model>}
   */
  list (endpoint, query, token, expectedContext) {
    URIValueType(endpoint, ['GenericAPIService.list', 'endpoint:URIValue'])
    MaybeJsonWebTokenType(token, ['GenericAPIService.get', 'token:?JsonWebToken'])
    MaybeURIValueType(expectedContext, ['GenericAPIService.list', 'expectedContext:?URIValue'])
    expectedContext = expectedContext || this.modelContext
    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.post(endpoint.toString(), query, header)
      .then(response => {
        if (response.data) {
          let model = this.apiService.createModelInstance(response.data)
          if (expectedContext) {
            return Promise
              .map(model.items, (model) => {
                this.validateModelContext(model, expectedContext)
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
      .catch(err => err.status, err => {
        throw httpProblemfromHttpError(err, 'Fetching of ' + endpoint + ' failed!')
      })
  }

  /**
   * Follow the links in a list
   *
   * @param {List} list
   * @param {String} dir
   * @param {JsonWebToken} token
   * @return {Promise.<appButton>}
   */
  navigateList (list, dir, token) {
    ListType(list, ['GenericAPIService.navigateList', 'list:List'])
    StringType(dir, ['GenericAPIService.navigateList', 'dir:String'])
    MaybeJsonWebTokenType(token, ['GenericAPIService.navigateList', 'token:?JsonWebToken'])
    return this.list(JSONLD.getRelLink(dir, list), {}, token)
  }

  /**
   * Update a resource
   *
   * @param {URIValue} endpoint
   * @param {Object} data
   * @param {Number} version
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  update (endpoint, data, version, token) {
    URIValueType(endpoint, ['GenericAPIService.update', 'endpoint:URIValue'])
    VersionNumberType(version, ['GenericAPIService.update', 'version:VersionNumber'])
    JsonWebTokenType(token, ['GenericAPIService.update', 'token:JsonWebToken'])
    let header = _merge(accept(this.apiService.mimeType), ifMatch(version), auth(token))
    return this.$http.put(endpoint.toString(), data, header)
      .catch(err => err.status, err => {
        throw httpProblemfromHttpError(err, 'Updating of ' + endpoint + ' failed!')
      })
  }

  /**
   * Delete a resource
   *
   * @param {URIValue} endpoint
   * @param {Number} version
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  delete (endpoint, version, token) {
    URIValueType(endpoint, ['GenericAPIService.delete', 'endpoint:URIValue'])
    VersionNumberType(version, ['GenericAPIService.delete', 'version:VersionNumber'])
    JsonWebTokenType(token, ['GenericAPIService.delete', 'token:JsonWebToken'])
    let header = _merge(accept(this.apiService.mimeType), ifMatch(version), auth(token))
    return this.$http.delete(endpoint.toString(), header)
      .catch(err => err.status, err => {
        throw httpProblemfromHttpError(err, 'Updating of ' + endpoint + ' failed!')
      })
  }
}
