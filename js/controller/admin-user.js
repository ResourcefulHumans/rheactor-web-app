'use strict'

const Promise = require('bluebird')
const HttpProblem = require('../model/http-problem')
const HttpProgress = require('../util/http').HttpProgress

function AdminUserController ($rootScope, $stateParams, IDService, ClientStorageService, UserService) {
  const self = this
  self.user = false
  self.p = new HttpProgress()

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
}

module.exports = AdminUserController
