import Promise from 'bluebird'

export function LogoutController (app) {
  app
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('logout', {
          url: '/logout',
          controller: ['ClientStorageService', '$state', function (ClientStorageService, $state) {
            Promise.join(
              ClientStorageService.remove('token'),
              ClientStorageService.remove('me')
            ).then(() => {
              $state.go('login', {from: 'logout'})
            })
          }],
          template: '<!-- blank -->'
        })
    }])
}
