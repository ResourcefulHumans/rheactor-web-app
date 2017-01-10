import {HttpProgress} from '../util/http'
import {JsonWebToken, HttpProblem} from 'rheactor-models'

export function AccountEmailChangeController ($stateParams, ClientStorageService, UserService) {
  const self = this
  self.p = new HttpProgress()
  self.p.activity()
  ClientStorageService.get('me')
    .then(user => UserService.confirmEmailChange(user, new JsonWebToken($stateParams.token)))
    .then(() => {
      self.p.success()
      ClientStorageService.getValidToken()
        .then(token => UserService.get(token.sub, token))
        .then(user => ClientStorageService.set('me', user))
    })
    .catch(err => HttpProblem.is(err), err => {
      self.p.error(err)
    })
}
