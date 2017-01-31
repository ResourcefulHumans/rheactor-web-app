export const RegisterRHeactorDecorators = angular => {
  angular
    .module('RHeactorDecoratorModule', [])
    /**
     * Angular $rootScope.Scope.$once
     * Copyright (c) 2014 marlun78
     * MIT License, https://gist.github.com/marlun78/bd0800cf5e8053ba9f83
     */
    .decorator('$rootScope', ($delegate) => {
      const Scope = $delegate.constructor
      Scope.prototype.$once = function (name, listener) {
        const deregister = this.$on(name, function () {
          deregister()
          listener.apply(this, arguments)
        })
        return deregister
      }
      return $delegate
    })
}
