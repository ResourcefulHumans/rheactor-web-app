'use strict'

const AccountAvatarController = require('./account-avatar')

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
              return new AccountAvatarController(Upload, $timeout, ClientStorageService, APIService)
            }
          ]
        })
    }])
}
