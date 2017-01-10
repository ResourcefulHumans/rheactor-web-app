export function WindowTitleController (app) {
  app
    .run(['$rootScope', '$window', 'FrontendConfig', '$state', '$timeout', ($rootScope, $window, config, $state, $timeout) => {
      let setTitle = (title) => {
        if (!title) return
        $window.document.title = title + ' | ' + config.appName
      }
      $rootScope.$watch('windowTitle', (title) => {
        setTitle(title)
      })
      $rootScope.$on('$locationChangeSuccess', () => {
        $timeout(() => {
          setTitle($state.current.title)
        })
      })
    }])
}
