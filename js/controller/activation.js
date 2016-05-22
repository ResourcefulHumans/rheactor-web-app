'use strict'

const Token = require('../model/jsonwebtoken')
const HttpProgress = require('../util/http').HttpProgress
const jsonld = require('../util/jsonld')
const HttpProblem = require('../model/http-problem')

module.exports = function (app) {
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
                    jsonld.getRelLink('activate-account', index),
                    {},
                    new Token($stateParams.token)
                  )
              })
              .then(() => {
                vm.p.success()
              })
              .catch(HttpProblem, (httpProblem) => {
                vm.p.error(httpProblem)
              })
            return vm
          }]
        })
    }])
}
