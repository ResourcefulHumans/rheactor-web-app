'use strict'

const HttpProblem = require('../model/http-problem')
const HttpProgress = require('../util/http').HttpProgress
const Token = require('../model/jsonwebtoken')

function AccountEmailChangeController ($stateParams, ClientStorageService, UserService) {
  const self = this
  self.p = new HttpProgress()
  self.p.activity()
  ClientStorageService.get('me')
    .then(user => UserService.confirmEmailChange(user, new Token($stateParams.token)))
    .then(() => {
      self.p.success()
      ClientStorageService.getValidToken()
        .then(token => UserService.get(token.sub, token))
        .then(user => ClientStorageService.set('me', user))
    })
    .catch(HttpProblem, err => {
      self.p.error(err)
    })
}

module.exports = AccountEmailChangeController
