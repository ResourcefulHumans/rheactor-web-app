'use strict'

const HttpProblem = require('../model/http-problem')
const HttpProgress = require('../util/http').HttpProgress

function AdminUserController ($rootScope, $stateParams, IDService, ClientStorageService, UserService) {
  const self = this
  self.user = false
  self.p = new HttpProgress()
  self.b = new HttpProgress()

  self.p.activity()
  ClientStorageService
    .getValidToken()
    .then(token => UserService.get(IDService.decode($stateParams.id), token))
    .then(user => {
      self.user = user
      $rootScope.windowTitle = user.name
      self.p.success()
    })
    .catch(HttpProblem, err => {
      self.p.error(err)
    })

  self.toggleActive = () => {
    if (self.b.$active) {
      return
    }
    self.b.activity()
    ClientStorageService
      .getValidToken()
      .then(token => self.user.active ? UserService.deactivate(self.user, token) : UserService.activate(self.user, token))
      .then(() => {
        self.b.success()
      })
      .catch(HttpProblem, (httpProblem) => {
        self.b.error(httpProblem)
      })
  }
}

module.exports = AdminUserController
