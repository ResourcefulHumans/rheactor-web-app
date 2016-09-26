'use strict'

const AdminUsersController = require('./admin-users')
const AdminUserController = require('./admin-user')

module.exports = function (app) {
  app
    .config(['$stateProvider', ($stateProvider) => {
      $stateProvider
        .state('admin', {
          url: '/admin',
          abstract: true,
          template: '<div data-ui-view></div>'
        })
        .state('admin.users', {
          url: '/users',
          title: 'Change Users',
          templateUrl: '/view/admin-users.html',
          controllerAs: 'vm',
          controller: [
            'ClientStorageService',
            'UserService',
            (ClientStorageService, UserService) => new AdminUsersController(ClientStorageService, UserService)
          ]
        })
        .state('admin.user', {
          url: '/user/:id',
          title: 'User',
          templateUrl: '/view/admin-user.html',
          controllerAs: 'vm',
          controller: [
            '$rootScope',
            '$timeout',
            '$stateParams',
            'IDService',
            'ClientStorageService',
            'UserService',
            ($rootScope, $timeout, $stateParams, IDService, ClientStorageService, UserService) => new AdminUserController($rootScope, $timeout, $stateParams, IDService, ClientStorageService, UserService)
          ]
        })
    }])
}
