'use strict'

const HttpProblem = require('../model/http-problem')
const jsonld = require('../util/jsonld')
const Promise = require('bluebird')

function AccountAvatarController (Upload, $timeout, ClientStorageService, APIService) {
  const self = this
  self.APIService = APIService
  self.Upload = Upload
  self.$timeout = $timeout
  self.ClientStorageService = ClientStorageService
  self.ClientStorageService.get('me')
    .then(user => {
      self.user = user
    })
}

AccountAvatarController.prototype.uploadFiles = function (file, errFiles) {
  const self = this
  self.f = file
  self.errFile = errFiles && errFiles[0]
  self.errorMsg = undefined
  if (!file) {
    return Promise.reject()
  }
  return Promise
    .join(
      self.getUploadUrl(),
      self.ClientStorageService.getValidToken()
    )
    .spread((url, token) => {
      file.upload = self.Upload.upload({
        url,
        data: {file: file},
        headers: {'Authorization': 'Bearer ' + token.token}
      })
      file.upload.then(
        self.onSuccess.bind(self, file),
        self.onError.bind(self),
        self.onProgress.bind(self, file)
      )
    })
}

/**
 * @returns {Promise.<String>}
 */
AccountAvatarController.prototype.getUploadUrl = function () {
  const self = this
  return self.APIService.index()
    .then(index => {
      return jsonld.getRelLink('avatar-upload', index)
    })
}

AccountAvatarController.prototype.onSuccess = function (file, response) {
  const self = this
  self.$timeout(() => {
    file.result = response.data.url
    self.user.avatar = response.data.url
    file.progress = 0
    self.user.updated()
    self.ClientStorageService.set('me', self.user)
  })
}

AccountAvatarController.prototype.onProgress = function (file, progressEvent) {
  file.progress = Math.min(100, parseInt(100.0 * progressEvent.loaded / progressEvent.total))
}

AccountAvatarController.prototype.onError = function (response) {
  const self = this
  if (response.status > 0) {
    self.errorMsg = HttpProblem.fromHttpError(response)
    self.f = undefined
  }
}

module.exports = AccountAvatarController
