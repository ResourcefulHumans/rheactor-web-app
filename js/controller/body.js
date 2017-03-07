export function BodyController (app) {
  app
    .run(['$rootScope', ($rootScope) => {
      const bodyClasses = {
        state: [],
        connection: 'connection-ok'
      }

      const updatedBodyClass = () => {
        $rootScope.bodyClass = bodyClasses.state.concat([bodyClasses.connection]).join(' ')
      }
      // This adds the state's name as a body class
      $rootScope.$on('$stateChangeStart', (event, toState) => {
        const stateClasses = []
        const parts = toState.name.split('.')
        while (parts.length > 0) {
          stateClasses.push(parts.join('-'))
          parts.pop()
        }
        bodyClasses.state = stateClasses
        updatedBodyClass()
      })

      // Add the connection status as a class
      $rootScope.$on('connection.ok', () => {
        bodyClasses.connection = 'connection-ok'
        updatedBodyClass()
      })
      $rootScope.$on('connection.error', () => {
        bodyClasses.connection = 'connection-error'
        updatedBodyClass()
      })
    }])
}
