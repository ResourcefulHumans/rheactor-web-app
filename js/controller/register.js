import {RegistrationModel} from '../model/registration'
import {GenericController} from './generic'
import {EmailValue} from 'rheactor-value-objects'

export function RegisterController (app) {
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
              let vm = GenericController(RegistrationModel, {
                onSubmit: data => new RegistrationModel(new EmailValue(data.email), data.password, data.firstname, data.lastname),
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
