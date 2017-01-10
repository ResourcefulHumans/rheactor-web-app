import {PasswordChangeConfirmModel} from '../model/password-change-confirm'
import {GenericController} from './generic'
import {JsonWebToken, HttpProblem} from 'rheactor-models'
import {HttpProgress} from '../util/http'
import {JSONLD} from '../util/jsonld'
import {EmailValue} from 'rheactor-value-objects'

export function PasswordChangeController (app) {
  app
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('password-change', {
          url: '/password-change',
          title: 'Reset your password',
          public: true,
          templateUrl: '/view/password-change.html',
          controllerAs: 'vm',
          controller: ['PasswordChangeService', 'PasswordChangeModel', (PasswordChangeService, PasswordChangeModel) => {
            return GenericController(PasswordChangeModel, {}, 'password-change', PasswordChangeService)
          }]
        })
        .state('password-change-confirm', {
          url: '/password-change/:token',
          title: 'Pick a new password',
          public: true,
          templateUrl: '/view/password-change-confirm.html',
          controllerAs: 'vm',
          controller: ['PasswordChangeConfirmService', '$stateParams', (PasswordChangeConfirmService, $stateParams) => {
            let vm = {}

            vm.p = new HttpProgress()

            vm.submit = (data) => {
              if (vm.p.$active) {
                return
              }
              vm.p.activity()
              PasswordChangeConfirmService.apiService.index()
                .then((index) => {
                  return PasswordChangeConfirmService
                    .create(
                      JSONLD.getRelLink('password-change-confirm', index),
                      new PasswordChangeConfirmModel(new EmailValue(data.email), data.password),
                      new JsonWebToken($stateParams.token)
                    )
                })
                .then(() => {
                  vm.p.success()
                })
                .catch(err => HttpProblem.is(err), httpProblem => {
                  vm.p.error(httpProblem)
                })
            }
            return vm
          }]
        })
    }])
}
