'use strict'

const logger = require('../util/logger')
const compareVersions = require('compare-versions')

/**
 * The AppUpdateController compares the frontend version to the backend version and if a mismatch is detected
 * publishes the server version on the $rootScope so a message can be displayed which asks the user to reload
 * the page with a query string to bust the browser cache
 *
 * @param app
 */
module.exports = function (app) {
  app
    .controller('AppUpdateController', ['$interval', 'StatusService', 'FrontendConfig', ($interval, StatusService, config) => {
      let checkTimer
      let vm = {
        updateNeeded: false
      }
      let checkForUpdate = () => {
        StatusService.status()
          .then((status) => {
            if (compareVersions(status.version, config.version) > 0) {
              logger.appInfo('Server version ' + status.version + ' is newer than my version ' + config.version)
              vm.updateNeeded = true
              vm.serverVersion = 'v' + status.version
              $interval.cancel(checkTimer)
            }
          })
      }
      checkForUpdate()
      checkTimer = $interval(checkForUpdate, 60 * 1000)

      return vm
    }])
}
