import {JsonWebToken, HttpProblem} from 'rheactor-models'
import {HttpProgress} from '../util/http'
import {JSONLD} from '../util/jsonld'

export function ActivationController (app) {
  app
    .config(['$stateProvider', ($stateProvider) => {
      $stateProvider
        .state('activation', {
          url: '/activate/:token',
          title: 'Activate your account',
          public: true,
          templateUrl: '/view/activation.html',
          controllerAs: 'vm',
          controller: ['ActivationService', '$stateParams', (ActivationService, $stateParams) => {
            let vm = {}

            vm.p = new HttpProgress()
            vm.p.activity()

            ActivationService.apiService.index()
              .then((index) => {
                return ActivationService
                  .create(
                    JSONLD.getRelLink('activate-account', index),
                    {},
                    new JsonWebToken($stateParams.token)
                  )
              })
              .then(() => {
                vm.p.success()
              })
              .catch(err => HttpProblem.is(err), (httpProblem) => {
                vm.p.error(httpProblem)
              })
            return vm
          }]
        })
    }])
}
