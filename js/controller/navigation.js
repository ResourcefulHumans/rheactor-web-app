'use strict'

/* global: document */

const moment = require('moment')
const debounce = require('lodash/debounce')
const $ = require('jquery')

module.exports = function (app) {
  app
    .controller('NavigationController', [
      'UserService',
      'ClientStorageService',
      'GoogleAnalyticsService',
      'TokenService',
      'RefreshTokenService',
      '$rootScope',
      '$scope',
      '$state',
      '$stateParams',
      '$window',
      (UserService, ClientStorageService, GoogleAnalyticsService, TokenService, RefreshTokenService, $rootScope, $scope, $state, $stateParams, $window) => {
        var vm = {
          authenticated: false,
          sync: true,
          stateName: '',
          on: {},
          state: $state
        }
        let updater
        let lifeTimeChecker

        ClientStorageService.subscribe($scope, function (event, property, value) {
          if (property === 'me') {
            if (value === undefined) {
              delete vm.me
              vm.authenticated = false
            } else {
              vm.me = value
              vm.authenticated = true
            }
          }
          if (property === 'token') {
            if (value === undefined) {
              delete vm.token
              RefreshTokenService.token = null
              if (updater) {
                $window.clearInterval(updater)
                $window.clearInterval(lifeTimeChecker)
                updater = false
                lifeTimeChecker = false
              }
            } else {
              vm.token = value
              RefreshTokenService.token = value
              updater = $window.setInterval(updateTimer, 1000)
              lifeTimeChecker = $window.setInterval(checkLifetime, 1000)
              updateTimer()
              checkLifetime()
            }
          }
        })

        let updateTimer = () => {
          $scope.$applyAsync(() => {
            if (!vm.token) {
              vm.tokenLifetime = 0
              vm.tokenLifetimeHuman = 'Expired'
              return
            }
            vm.tokenLifetime = Math.max(vm.token.exp.getTime() - Date.now(), 0)
            vm.tokenLifetimeHuman = moment.duration(vm.tokenLifetime).humanize()
          })
        }

        vm.refreshToken = RefreshTokenService.refresh.bind(RefreshTokenService)

        let checkLifetime = function () {
          if (!vm.token) {
            return
          }
          let tokenLifetime = Math.max(vm.token.exp.getTime() - Date.now(), 0)
          if (!tokenLifetime) {
            ClientStorageService.remove('me')
            ClientStorageService.remove('token')
            $state.go('login', {'from': 'TokenExpiredError'})
          }
        }

        let on = {}
        $rootScope.$on('$stateChangeSuccess', () => {
          vm.stateName = $state.current.name
          vm.stateParams = $stateParams
          vm.state = $state.current
          RefreshTokenService.maybeRefreshToken()

          on = {}
          let parts = vm.stateName.split('.')
          while (parts.length > 0) {
            on[parts.join('.')] = true
            parts.pop()
          }
        })

        vm.onState = (state) => {
          return on[state]
        }

        $rootScope.$on('sync', (event, sync) => {
          vm.sync = sync
        })
        $(document).on('click touch', debounce(RefreshTokenService.maybeRefreshToken.bind(RefreshTokenService), 1000))

        return vm
      }
    ])
}
