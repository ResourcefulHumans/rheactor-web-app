import {GenericController} from './generic'
import {EmailValue} from 'rheactor-value-objects'

export function LoginController (app) {
  app
    .config(['$stateProvider', ($stateProvider) => {
      $stateProvider
        .state('login', {
          url: '/login?from&returnTo',
          templateUrl: '/view/login.html',
          controllerAs: 'vm',
          title: 'Login',
          public: true,
          controller: [
            'LoginModel',
            'LoginService',
            'UserService',
            'ClientStorageService',
            '$state',
            '$window',
            '$stateParams',
            '$location',
              /**
               * @param {LoginModel} LoginModel
               * @param {LoginService} LoginService
               * @param {UserService} UserService
               * @param {ClientStorageService} ClientStorageService
               * @param $state
               * @param $window
               * @param $stateParams
               * @param $location
               */
            (LoginModel, LoginService, UserService, ClientStorageService, $state, $window, $stateParams, $location) => {
              let vm = GenericController(
                LoginModel,
                {
                  onSubmit: data => new LoginModel(new EmailValue(data.email), data.password),
                  success: (result) => {
                    return UserService.get(result.sub, result)
                      .then(function (user) {
                        return ClientStorageService.set('me', user)
                      })
                      .then(() => {
                        return ClientStorageService.set('token', result)
                      })
                      .then(() => {
                        let returnTo = $stateParams.returnTo
                        if (!returnTo) {
                          returnTo = $window.localStorage.getItem('returnTo')
                          $window.localStorage.removeItem('returnTo')
                        }
                        if (returnTo) {
                          returnTo = decodeURIComponent(returnTo)
                          $location.path(returnTo.substr(2))
                          $location.search('returnTo', null)
                          $location.replace()
                        } else {
                          $state.transitionTo('dashboard')
                        }
                      })
                  }
                },
                'login',
                LoginService
              )
              vm.from = $stateParams.from
              vm.returnTo = $stateParams.returnTo
              return vm
            }]
        })
    }])
}
