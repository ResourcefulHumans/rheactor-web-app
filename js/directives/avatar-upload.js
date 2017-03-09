import {httpProblemfromHttpError, httpProblemfromException} from '../util/http-problem'
import {HttpProgress, accept, auth} from '../util/http'
import Promise from 'bluebird'
import {URIValue} from 'rheactor-value-objects'
import {RHeactorImageServiceService} from '../services/rheactor-image-service'
import {HttpProblem} from 'rheactor-models'

export const AvatarUploadDirective = (Upload, $timeout, imageService, ClientStorageService, TokenService) => ({
  restrict: 'E',
  scope: {
    label: '=',
    avatar: '=',
    success: '=',
    successBindThis: '=?'
  },
  templateUrl: '/directive/avatar-upload-form.html',
  link: scope => {
    scope.p = new HttpProgress()
    scope.uploadFiles = (file, errFiles) => {
      scope.f = file
      scope.errFile = errFiles && errFiles[0]
      if (!file) return
      scope.p.activity()
      return Promise
        .join(
          ClientStorageService.getValidToken().then(token => TokenService.createUserToken(token, 'rheactor-image-service')),
          imageService.getUploadURI(),
          Upload.base64DataUrl(file)
        )
        .spread((token, uploadURI, fileData) => {
          const headers = Object.assign({}, auth(token).headers, accept(RHeactorImageServiceService.mimeType).headers)
          file.upload = Upload.http({
            url: uploadURI.toString(),
            data: {
              $context: RHeactorImageServiceService.$context.toString(),
              image: fileData.substr(fileData.match(/data:[^;]+;base64,/)[0].length),
              mimeType: file.type
            },
            headers: headers
          })
          file.upload.then(
            response => {
              if (response.status >= 400) return error(response)
              $timeout(() => {
                file.result = response.data.url
                file.progress = 0
                scope.success.call(scope.successBindThis, new URIValue(response.data.url))
                  .then(() => {
                    scope.p.success()
                  })
                  .catch(err => {
                    scope.p.error(HttpProblem.is(err) ? err : httpProblemfromException(err))
                  })
              })
            },
            response => error(response),
            progressEvent => {
              file.progress = Math.min(100, parseInt(100.0 * progressEvent.loaded / progressEvent.total))
            }
          )
        })
    }

    const error = (response) => {
      if (response.status > 0) {
        scope.f = undefined
        scope.p.error(httpProblemfromHttpError(response))
      }
    }
  }
})
