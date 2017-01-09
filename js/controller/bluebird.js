'use strict'

/* global angular trackJs */

const logger = require('../util/logger')
const EntryNotFoundError = require('rheactor-value-objects/errors/entry-not-found')

module.exports = function () {
  angular
    .module('mwl.bluebird')
    .run(['$q', '$state', ($q, $state) => {
      $q.onPossiblyUnhandledRejection(function (error) {
        let errorName = error.name || error.constructor.name
        // Ignore exceptions for handling routing
        if ((error.message && error.message.match(/^transition (superseded|prevented|aborted|failed)$/)) || error.toString() === 'canceled') {
          return
        }
        if (errorName === 'UnauthorizedError' || errorName === 'UnauthorizedError') {
          logger.appInfo('Handling unhandled rejection', errorName, '-> redirecting to logout')
          $state.go('logout')
          return
        }
        let returnTo = $state.href($state.current.name, $state.params)
        if (errorName === 'TokenExpiredError') {
          if ($state.current.public) {
            return
          }
          $state.go('login', {'from': errorName, returnTo})
          return
        }
        if (EntryNotFoundError.is(error) &&
          (error.message === 'token' || error.message === 'me') &&
          ($state.current.name === '' || !$state.current.public)) {
          $state.go('login', {returnTo})
          return
        }
        logger.appWarning('Unhandled rejection', error)
        trackJs.track(error)
      })
    }])
}
