'use strict'

const AccountAvatarController = require('./account-avatar')
const AccountProfileController = require('./account-profile')
const AccountEmailChangeController = require('./account-email-change-confirm')

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
        .state('account.profile', {
          url: '/profile',
          title: 'Change Profile',
          templateUrl: '/view/account-profile.html',
          controllerAs: 'vm',
          controller: [
            '$rootScope',
            '$timeout',
            'ClientStorageService',
            'UserService',
            ($rootScope, $timeout, ClientStorageService, UserService) => new AccountProfileController($rootScope, $timeout, ClientStorageService, UserService)
          ]
        })
        .state('account.email-change-confirm', {
          url: '/email-change/:token',
          title: 'Confirm email',
          templateUrl: '/view/account-email-change-confirm.html',
          controllerAs: 'vm',
          controller: [
            '$stateParams',
            'ClientStorageService',
            'UserService',
            ($stateParams, ClientStorageService, UserService) => new AccountEmailChangeController($stateParams, ClientStorageService, UserService)
          ]
        })
    }])
}
