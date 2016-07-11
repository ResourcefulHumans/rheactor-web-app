'use strict'

/**
 * Track angular.js page views in Google Analytics
 *
 * @param {object} $rootScope
 * @param {object} $window
 * @param {object} $location
 */
function GoogleAnalyticsService ($rootScope, $window, $location) {
  let lastPath

  function track () {
    let path = $location.path()

    if (lastPath === path) { // Only track once per path, the $viewContentLoaded event is fired multiple times
      return
    }

    // Remove sensitive data from these paths
    if (/^\/activate\/.+$/.test(path)) {
      path = '/activate/--redacted--'
    }
    if (/^\/password-change\/.+$/.test(path)) {
      path = '/password-change/--redacted--'
    }

    let data = {
      page: path
    }

    $window.ga('send', 'pageview', data)
    lastPath = path
  }

  if ($window.ga) { // Google Analytics might be blocked
    $rootScope.$on('$viewContentLoaded', track)
  }
}

module.exports = GoogleAnalyticsService
