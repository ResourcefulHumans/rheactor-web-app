'use strict'

const Registration = require('../model/registration')
const genericController = require('./generic')

module.exports = function (app) {
  app
    .config(['$stateProvider', ($stateProvider) => {
      $stateProvider
        .state('register', {
          url: '/register?returnTo',
          public: true,
          title: 'Register',
          templateUrl: '/view/registration.html',
          controllerAs: 'vm',
          controller: [
            'RegistrationService',
            '$window',
            '$stateParams',
            /**
             * @param {RegistrationService} RegistrationService
             * @param {object} $window
             * @param {object} $stateParams
             */
            (RegistrationService, $window, $stateParams) => {
              let vm = genericController(Registration, {
                success: () => {
                  if ($stateParams.returnTo) {
                    $window.localStorage.setItem('returnTo', $stateParams.returnTo)
                  }
                }
              }, 'register', RegistrationService)
              vm.returnTo = $stateParams.returnTo
              return vm
            }]
        })
    }])
}
