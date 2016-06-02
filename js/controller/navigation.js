'use strict'

const _padStart = require('lodash/padStart')
const logger = require('../util/logger')
const moment = require('moment')

module.exports = function (app) {
  app
    .controller('NavigationController', [
      'UserService',
      'ClientStorageService',
      'TokenService',
      '$rootScope',
      '$scope',
      '$state',
      '$stateParams',
      '$window',
      (UserService, ClientStorageService, TokenService, $rootScope, $scope, $state, $stateParams, $window) => {
        var vm = {
          authenticated: false,
          sync: true,
          stateName: '',
          on: {}
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
              if (updater) {
                $window.clearInterval(updater)
                $window.clearInterval(lifeTimeChecker)
                updater = false
                lifeTimeChecker = false
              }
            } else {
              vm.token = value
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

        let refreshing = false
        vm.refreshToken = function () {
          if (refreshing) {
            return
          }
          refreshing = true
          TokenService.create(vm.token)
            .then((token) => {
              ClientStorageService.set('token', token)
              refreshing = false
            })
        }

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
          if (!vm.token) {
            return
          }
          if (Math.max(vm.token.exp.getTime() - Date.now(), 0) / (vm.token.exp.getTime() - vm.token.iat.getTime()) < 0.10) {
            logger.appInfo('Auto refreshing token')
            vm.refreshToken()
          }

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

        return vm
      }
    ])
}
