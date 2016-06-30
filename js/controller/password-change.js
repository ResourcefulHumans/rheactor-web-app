'use strict'

const PasswordChangeConfirm = require('../model/password-change-confirm')
const genericController = require('./generic')
const Token = require('../model/jsonwebtoken')
const HttpProgress = require('../util/http').HttpProgress
const jsonld = require('../util/jsonld')
const HttpProblem = require('../model/http-problem')

module.exports = function (app) {
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
            return genericController(PasswordChangeModel, {}, 'password-change', PasswordChangeService)
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
                      jsonld.getRelLink('password-change-confirm', index),
                      new PasswordChangeConfirm(data),
                      new Token($stateParams.token)
                    )
                })
                .then(() => {
                  vm.p.success()
                })
                .catch(HttpProblem, (httpProblem) => {
                  vm.p.error(httpProblem)
                })
            }
            return vm
          }]
        })
    }])
}
