import {IDParamFilter} from './idparam'

export const RegisterRHeactorFilters = angular => {
  angular
    .module('RHeactorFilterModule', [])
    .filter('idparam', ['$location', 'IDService', function ($location, IDService) {
      return IDParamFilter($location, IDService)
    }])
}
