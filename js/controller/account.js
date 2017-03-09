import {AccountAvatarController} from './account-avatar'
import {AccountProfileController} from './account-profile'
import {AccountEmailChangeController} from './account-email-change-confirm'

export function AccountController (app) {
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
            'ClientStorageService',
            'UserService',
            (ClientStorageService, UserService) => new AccountAvatarController(ClientStorageService, UserService)
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
