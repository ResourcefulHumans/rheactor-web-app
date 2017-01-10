import {GenericAPIService} from '../services/generic'
import {JSONLD} from '../util/jsonld'
import {JsonWebToken} from 'rheactor-models'

/**
 * @param $http
 * @param {APIService} apiService
 */
export class TokenService extends GenericAPIService {
  constructor ($http, apiService) {
    super($http, apiService, JsonWebToken.$context)
  }

  /**
   * @param {JsonWebToken} token
   * @returns {Promise.<JsonWebToken>}
   */
  create (token) {
    return super.create(JSONLD.getRelLink('token-renew', token), token, token)
  }
}
