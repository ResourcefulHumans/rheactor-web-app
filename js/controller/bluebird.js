import {appLogger} from '../util/logger'
import {HttpProblem} from 'rheactor-models'
import {EntryNotFoundError} from '@resourcefulhumans/rheactor-errors'

/* globals trackJs */

const logger = appLogger()

export const BluebirdController = angular => {
  angular
    .module('mwl.bluebird')
    .run(['$q', '$state', ($q, $state) => {
      $q.onPossiblyUnhandledRejection(error => {
        let errorName = error.name || error.constructor.name
        // Ignore exceptions for handling routing
        if ((error.message && error.message.match(/^transition (superseded|prevented|aborted|failed)$/)) || error.toString() === 'canceled') {
          return
        }
        if (errorName === 'UnauthorizedError' || (HttpProblem.is(error) && error.status === 401)) {
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
