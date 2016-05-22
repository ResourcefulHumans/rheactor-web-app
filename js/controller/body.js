'use strict'

module.exports = function (app) {
  app
    .run(['$rootScope', ($rootScope) => {
      $rootScope.$on('$stateChangeStart', (event, toState) => {
        let bodyClasses = []
        let parts = toState.name.split('.')
        while (parts.length > 0) {
          bodyClasses.push(parts.join('-'))
          parts.pop()
        }
        $rootScope.bodyClass = bodyClasses.join(' ')
      })
    }])
}
