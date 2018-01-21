import {HttpProblem} from 'rheactor-models'
import {HttpProgress} from '../util/http'
import _cloneDeep from 'lodash/cloneDeep'
import Promise from 'bluebird'
import {httpProblemfromException} from '../util/http-problem'
import {JSONLD} from '../util/jsonld'
import {PasswordChangeConfirmModel} from '../model/password-change-confirm'

export function AccountProfileController ($rootScope, $timeout, ClientStorageService, UserService, PasswordChangeConfirmService) {
  const self = this
  self.user = false
  self.userCopy = false
  self.p = new HttpProgress()
  self.e = new HttpProgress()
  self.c = new HttpProgress()
  self.cp = new HttpProgress()

  self.p.activity()

  Promise
    .join(
      ClientStorageService.get('me'),
      ClientStorageService.getValidToken()
    )
    .spread((me, token) => UserService.get(me.$id, token))
    .then(user => {
      self.user = user
      self.userCopy = _cloneDeep(user)
      $rootScope.windowTitle = user.name
      self.p.success()
    })
    .catch(err => {
      self.p.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
    })

  // Update profile
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
        ClientStorageService.set('me', user)
        timeout = $timeout(() => {
          self.e.reset()
        }, 1000)
      })
      .catch(err => {
        self.e.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
      })
  }

  // Update email
  self.changeUserEmail = () => {
    if (self.c.$active) {
      return
    }
    self.c.activity()
    ClientStorageService
      .getValidToken()
      .then(token => UserService.requestEmailChange(self.user, self.newEmail, token))
      .then(() => {
        self.c.success()
      })
      .catch(err => {
        self.c.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
      })
  }

  // Update passwd
  self.changePassword = () => {
    if (self.cp.$active) {
      return
    }
    self.cp.activity()
    ClientStorageService
      .getValidToken()
      .then(token => PasswordChangeConfirmService.apiService.index()
        .then((index) => {
          return PasswordChangeConfirmService
          .create(
            JSONLD.getRelLink('password-change-confirm', index),
            new PasswordChangeConfirmModel(self.newPassword),
            token
          )
        })
    )
    .then(() => {
      self.cp.success()
    })
    .catch(err => {
      self.cp.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
    })
  }
}
