import {LoginModel} from './login'
import {PasswordChangeModel} from './password-change'

export const RegisterRHeactorModels = angular => {
  angular
    .module('RHeactorModelModule', [])
    .service('LoginModel', () => {
      return LoginModel
    })
    .service('PasswordChangeModel', () => {
      return PasswordChangeModel
    })
}
