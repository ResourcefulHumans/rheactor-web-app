import {httpProblemfromHttpError} from '../util/http-problem'
import {JSONLD} from '../util/jsonld'
import Promise from 'bluebird'

export class AccountAvatarController {
  constructor (Upload, $timeout, ClientStorageService, APIService) {
    this.APIService = APIService
    this.Upload = Upload
    this.$timeout = $timeout
    this.ClientStorageService = ClientStorageService
    this.ClientStorageService.get('me')
      .then(user => {
        this.user = user
      })
  }

  uploadFiles (file, errFiles) {
    this.f = file
    this.errFile = errFiles && errFiles[0]
    this.errorMsg = undefined
    if (!file) {
      return Promise.reject()
    }
    return Promise
      .join(
        this.getUploadUrl(),
        this.ClientStorageService.getValidToken()
      )
      .spread((url, token) => {
        file.upload = this.Upload.upload({
          url: url.toString(),
          data: {file: file},
          headers: {'Authorization': 'Bearer ' + token.token}
        })
        file.upload.then(
          this.onSuccess.bind(this, file),
          this.onError.bind(this),
          this.onProgress.bind(this, file)
        )
      })
  }

  /**
   * @returns {Promise.<String>}
   */
  getUploadUrl () {
    return this.APIService.index()
      .then(index => {
        return JSONLD.getRelLink('avatar-upload', index)
      })
  }

  onSuccess (file, response) {
    this.$timeout(() => {
      file.result = response.data.url
      this.user.avatar = response.data.url
      file.progress = 0
      this.user = this.user.updated()
      this.ClientStorageService.set('me', this.user)
    })
  }

  onProgress (file, progressEvent) {
    file.progress = Math.min(100, parseInt(100.0 * progressEvent.loaded / progressEvent.total))
  }

  onError (response) {
    if (response.status > 0) {
      this.errorMsg = httpProblemfromHttpError(response)
      this.f = undefined
    }
  }

}
