'use strict'

const Promise = require('bluebird')
const HttpProblem = require('../model/http-problem')
const HttpProgress = require('../util/http').HttpProgress

function AdminUserController (ClientStorageService, UserService) {
  const self = this
  self.paginatedList = false
  self.p = new HttpProgress()
  self.l = new HttpProgress()

  const fetch = list => {
    if (self.l.$active) {
      return
    }
    self.l.activity()
    list()
      .then(paginatedList => {
        self.paginatedList = paginatedList
        self.l.success()
      })
      .catch(HttpProblem, err => {
        self.l.error(err)
      })
  }

  const refresh = () => ClientStorageService.getValidToken().then(token => fetch(UserService.listUsers.bind(UserService, {}, token)))
  refresh()

  self.next = () => ClientStorageService.getValidToken().then(token => fetch(UserService.navigateList.bind(UserService, self.paginatedList, 'next', token)))
  self.prev = () => ClientStorageService.getValidToken().then(token => fetch(UserService.navigateList.bind(UserService, self.paginatedList, 'prev', token)))

  self.submit = (data) => {
    if (self.p.$active) {
      return
    }
    self.p.activity()
    return ClientStorageService.getValidToken()
      .then(token => UserService.create(data, token)
        .then(() => {
          refresh()
          self.p.success()
        })
        .catch(HttpProblem, (httpProblem) => {
          self.p.error(httpProblem)
        })
      )
  }
}

module.exports = AdminUserController
