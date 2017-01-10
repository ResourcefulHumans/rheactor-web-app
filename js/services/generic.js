import {httpProblemfromHttpError} from '../util/http-problem'
import {auth, accept, ifMatch} from '../util/http'
import _merge from 'lodash/merge'
import Promise from 'bluebird'
import {ApplicationError} from '@resourcefulhumans/rheactor-errors'
import {JSONLD} from '../util/jsonld'
import {URIValueType, MaybeURIValueType} from 'rheactor-value-objects'
import {HttpProblem} from 'rheactor-models'

export class GenericAPIService {
  /**
   * @param $http
   * @param {APIService} apiService
   * @param {URIValue} modelContext
   */
  constructor ($http, apiService, modelContext) {
    URIValueType(modelContext)
    this.$http = $http
    this.apiService = apiService
    this.modelContext = modelContext
  }

  /**
   * @param model
   * @param {URIValue} expectedContext
   */
  validateModelContext (model, expectedContext) {
    MaybeURIValueType(expectedContext)
    expectedContext = expectedContext || this.modelContext
    if (expectedContext && !expectedContext.equals(model.$context)) {
      throw new ApplicationError('Unexpected model context! Got "' + model.$context + '", expected "' + expectedContext.toString() + "'")
    }
  }

  /**
   * @param {String} endpoint
   * @param {Model} model
   * @param {JsonWebToken} token
   * @param {boolean} fetch Fetch the created model, defaults to true, if false returns the location header value if present
   * @returns {Promise.<Model|String>}
   */
  create (endpoint, model, token, fetch) {
    fetch = fetch !== false

    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.post(endpoint, model, header)
      .then(response => {
        if (response.data) {
          const model = this.apiService.createModelInstance(response.data)
          this.validateModelContext(model)
          return model
        }
        const location = response.headers('Location')
        if (location) {
          if (fetch) {
            return this.get(location, token)
          } else {
            return location
          }
        }
        return null
      })
      .catch(httpError => {
        throw httpProblemfromHttpError(httpError, 'Creation of ' + model.$context + ' failed!')
      })
  }

  /**
   * @param {String} endpoint
   * @param {object} query
   * @param {JsonWebToken} token
   * @returns {Promise.<Model|null>}
   */
  query (endpoint, query, token) {
    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.post(endpoint, query, header)
      .then(response => {
        if (!response.data) return null
        const model = this.apiService.createModelInstance(response.data)
        this.validateModelContext(model)
        return model
      })
      .catch(httpError => {
        throw httpProblemfromHttpError(httpError, 'Query to ' + endpoint + ' failed!')
      })
  }

  /**
   * @param {String} $id
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  get ($id, token) {
    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.get($id, header)
      .then(response => {
        if (response.data) {
          let model = this.apiService.createModelInstance(response.data)
          this.validateModelContext(model)
          return model
        }
        return null
      })
      .catch(err => {
        if (err.status) {
          throw httpProblemfromHttpError(err, 'Fetching of ' + $id + ' failed!')
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
  list (endpoint, query, token, expectedContext) {
    expectedContext = expectedContext || this.modelContext
    let header = accept(this.apiService.mimeType)
    if (token) {
      _merge(header, auth(token))
    }
    return this.$http.post(endpoint, query, header)
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
      .catch(err => {
        if (err.status) {
          throw httpProblemfromHttpError(err, 'Fetching of ' + endpoint + ' failed!')
        }
        throw HttpProblem.fromException(err, 500)
      })
  }

  /**
   * Follow the links in a list
   *
   * @param {appButton} list
   * @param {String} dir
   * @param {JsonWebToken} token
   * @return {Promise.<appButton>}
   */
  navigateList (list, dir, token) {
    return this.list(JSONLD.getRelLink(dir, list), {}, token)
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
  update (endpoint, data, version, token) {
    let header = _merge(accept(this.apiService.mimeType), ifMatch(version), auth(token))
    return this.$http.put(endpoint, data, header)
      .catch(err => {
        if (err.status) {
          throw httpProblemfromHttpError(err, 'Updating of ' + endpoint + ' failed!')
        }
        throw HttpProblem.fromException(err, 500)
      })
  }

  /**
   * Delete a resource
   *
   * @param {String} endpoint
   * @param {Number} version
   * @param {JsonWebToken} token
   * @returns {Promise.<Model>}
   */
  delete (endpoint, version, token) {
    let header = _merge(accept(this.apiService.mimeType), ifMatch(version), auth(token))
    return this.$http.delete(endpoint, header)
      .catch(err => {
        if (err.status) {
          throw httpProblemfromHttpError(err, 'Updating of ' + endpoint + ' failed!')
        }
        throw HttpProblem.fromException(err, 500)
      })
  }
}
