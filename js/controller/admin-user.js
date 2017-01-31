import {HttpProblem} from 'rheactor-models'
import {HttpProgress} from '../util/http'
import {httpProblemfromException} from '../util/http-problem'
import _cloneDeep from 'lodash/cloneDeep'

export function AdminUserController ($rootScope, $timeout, $stateParams, IDService, ClientStorageService, UserService) {
  const self = this
  self.user = false
  self.userCopy = false
  self.p = new HttpProgress()
  self.b = new HttpProgress()
  self.e = new HttpProgress()

  self.p.activity()
  ClientStorageService
    .getValidToken()
    .then(token => UserService.get(IDService.decodeURI($stateParams.id), token))
    .then(user => {
      self.user = user
      self.userCopy = _cloneDeep(user)
      $rootScope.windowTitle = user.name
      self.p.success()
    })
    .catch(err => {
      self.p.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
    })

  self.toggleActive = () => {
    if (self.b.$active) {
      return
    }
    self.b.activity()
    ClientStorageService
      .getValidToken()
      .then(token => UserService.updateProperty(self.user, 'active', !self.user.active, token))
      .then(() => {
        self.b.success()
      })
      .catch(err => {
        self.b.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
      })
  }

  let timeout
  self.updateUserProperty = (property) => {
    if (self.e.$active) {
      return
    }
    if (self.userCopy[property] === self.user[property]) {
      return
    }
    self.e.activity()
    if (timeout) {
      $timeout.cancel(timeout)
      timeout = null
    }
    ClientStorageService
      .getValidToken()
      .then(token => UserService.updateProperty(self.user, property, self.userCopy[property], token))
      .then(user => {
        self.e.success()
        self.user = user
        self.userCopy = _cloneDeep(self.user)
        timeout = $timeout(() => {
          self.e.reset()
        }, 1000)
      })
      .catch(err => {
        self.e.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
      })
  }
}

