import {httpProblemfromHttpError} from '../util/http-problem'
import Promise from 'bluebird'
import {accept, auth} from '../util/http'
import {RHeactorImageServiceService} from '../services/rheactor-image-service'

export class AccountAvatarController {
  constructor (Upload, $timeout, ClientStorageService, APIService, TokenService, RHeactorImageServiceService, UserService) {
    this.APIService = APIService
    this.Upload = Upload
    this.$timeout = $timeout
    this.ClientStorageService = ClientStorageService
    this.ClientStorageService.get('me')
      .then(user => {
        this.user = user
      })
    this.TokenService = TokenService
    this.imageService = RHeactorImageServiceService
    this.UserService = UserService
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
        this.ClientStorageService.getValidToken().then(token => this.TokenService.createUserToken(token, 'rheactor-image-service')),
        this.imageService.getUploadURI(),
        this.Upload.base64DataUrl(file)
      )
      .spread((token, uploadURI, fileData) => {
        const headers = Object.assign({}, auth(token).headers, accept(RHeactorImageServiceService.mimeType).headers)
        file.upload = this.Upload.http({
          url: uploadURI.toString(),
          data: {
            $context: RHeactorImageServiceService.$context.toString(),
            image: fileData.substr(fileData.match(/data:[^;]+;base64,/)[0].length),
            mimeType: file.type
          },
          headers: headers
        })
        file.upload.then(
          this.onSuccess.bind(this, file),
          this.onError.bind(this),
          this.onProgress.bind(this, file)
        )
      })
  }

  onSuccess (file, response) {
    this.$timeout(() => {
      file.result = response.data.url
      file.progress = 0
      this.user.avatar = response.data.url
      this.ClientStorageService.getValidToken().then(token => this.UserService.updateProperty(this.user, 'avatar', response.data.url, token))
        .then(user => {
          this.user = user
          this.ClientStorageService.set('me', user)
        })
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
