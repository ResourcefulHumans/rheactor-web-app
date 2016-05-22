'use strict'

const Login = require('../model/login')
const genericController = require('./generic')

module.exports = function (app) {
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
            'LoginService',
            'UserService',
            'ClientStorageService',
            '$state',
            '$stateParams',
            '$location',
              /**
               * @param {LoginService} LoginService
               * @param {UserService} UserService
               * @param {ClientStorageService} ClientStorageService
               * @param $state
               * @param $stateParams
               * @param $location
               */
            (LoginService, UserService, ClientStorageService, $state, $stateParams, $location) => {
              let vm = genericController(
                Login,
                {
                  success: (result) => {
                    return UserService.get(result.sub, result)
                      .then(function (user) {
                        return ClientStorageService.set('me', user)
                      })
                      .then(() => {
                        return ClientStorageService.set('token', result)
                      })
                      .then(() => {
                        if ($stateParams.returnTo) {
                          $location.path($stateParams.returnTo.substr(2))
                          $location.search()
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
              return vm
            }]
        })
    }])
}
