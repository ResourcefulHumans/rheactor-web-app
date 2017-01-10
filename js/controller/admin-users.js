import {HttpProblem} from 'rheactor-models'
import {HttpProgress} from '../util/http'

export function AdminUsersController (ClientStorageService, UserService) {
  const self = this
  self.paginatedList = false
  self.p = new HttpProgress()
  self.l = new HttpProgress()
  self.searchTerm = ''

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

  const refresh = () => {
    const query = {}
    if (self.searchTerm.length) {
      query.email = self.searchTerm
    }
    return ClientStorageService.getValidToken().then(token => fetch(UserService.listUsers.bind(UserService, query, token)))
  }
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

  self.search = refresh
}

