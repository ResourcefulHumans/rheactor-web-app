import {URIValue} from 'rheactor-value-objects'

export class AccountAvatarController {
  constructor (ClientStorageService, UserService) {
    this.uploadSuccess = avatarUrl => {
      return ClientStorageService.getValidToken()
        .then(token => UserService.updateProperty(this.user, 'avatar', avatarUrl.toString(), token))
        .then(u => {
          ClientStorageService.set('me', u)
          this.user = u
        })
    }
    ClientStorageService.getValidToken()
      .then(token => UserService.get(new URIValue(token.sub), token))
      .then(user => {
        this.user = user
      })
  }
}
