'use strict'

const HttpProblem = require('../model/http-problem')
const jsonld = require('../util/jsonld')

module.exports = function (app) {
  app
    .config(['$stateProvider', ($stateProvider) => {
      $stateProvider
        .state('account', {
          url: '/account',
          abstract: true,
          template: '<div data-ui-view></div>'
        })
        .state('account.avatar', {
          url: '/avatar',
          title: 'Change Avatar',
          templateUrl: '/view/account-avatar.html',
          controllerAs: 'vm',
          controller: [
            'Upload',
            '$timeout',
            'ClientStorageService',
            'APIService',
            (Upload, $timeout, ClientStorageService, APIService) => {
              let vm = {}
              Promise
                .join(
                  ClientStorageService.getValidToken(),
                  ClientStorageService.get('me')
                )
                .spread((token, me) => {
                  vm.user = me
                  vm.uploadFiles = (file, errFiles) => {
                    vm.f = file
                    vm.errFile = errFiles && errFiles[0]
                    vm.errorMsg = undefined
                    if (file) {
                      APIService.index()
                        .then((index) => {
                          file.upload = Upload.upload({
                            url: jsonld.getRelLink('avatar-upload', index),
                            data: {file: file},
                            headers: {'Authorization': 'Bearer ' + token.token}
                          })
                          file.upload.then(
                            (response) => {
                              $timeout(() => {
                                file.result = response.data.url
                                vm.user.avatar = response.data.url
                                file.progress = 0
                                vm.user.updated()
                                ClientStorageService.set('me', vm.user)
                              })
                            },
                            (response) => {
                              if (response.status > 0) {
                                vm.errorMsg = HttpProblem.fromHttpError(response)
                                vm.f = undefined
                              }
                            },
                            (evt) => {
                              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total))
                            }
                          )
                        })
                    }
                  }
                })
              return vm
            }
          ]
        })
    }])
}
