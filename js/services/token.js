import {GenericAPIService} from '../services/generic'
import {JSONLD} from '../util/jsonld'
import {JsonWebToken, JsonWebTokenType} from 'rheactor-models'
import {maybe, String as StringType} from 'tcomb'
const MaybeStringType = maybe(StringType)

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
    JsonWebTokenType(token, ['TokenService', 'create()', 'token:JsonWebToken'])
    return super.create(JSONLD.getRelLink('token-renew', token), token, token)
  }

  /**
   * Creates a read-only token for the user and the given audiend
   * @param {JsonWebToken} token
   * @param {String|undefined} aud
   * @returns {Promise.<JsonWebToken>}
   */
  createUserToken (token, aud) {
    JsonWebTokenType(token, ['TokenService', 'createUserToken()', 'token:JsonWebToken'])
    MaybeStringType(aud, ['TokenService', 'createUserToken()', 'audience:?String'])
    return this.apiService.index().then(index => super.create(JSONLD.getRelLink('create-token', index), {aud}, token))
  }
}
