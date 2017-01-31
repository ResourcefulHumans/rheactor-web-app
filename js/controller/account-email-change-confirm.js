import {HttpProgress} from '../util/http'
import {JsonWebToken, HttpProblem} from 'rheactor-models'
import {URIValue} from 'rheactor-value-objects'
import {httpProblemfromException} from '../util/http-problem'

export function AccountEmailChangeController ($stateParams, ClientStorageService, UserService) {
  const self = this
  self.p = new HttpProgress()
  self.p.activity()
  ClientStorageService.get('me')
    .then(user => UserService.confirmEmailChange(user, new JsonWebToken($stateParams.token)))
    .then(() => {
      self.p.success()
      ClientStorageService.getValidToken()
        .then(token => UserService.get(new URIValue(token.sub), token))
        .then(user => ClientStorageService.set('me', user))
    })
    .catch(err => {
      self.p.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
    })
}
