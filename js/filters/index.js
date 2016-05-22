'use strict'

require('angular')
  .module('RHeactorFilterModule', [])
  .filter('idparam', ['$location', 'IDService', function ($location, IDService) {
    return require('./idparam')($location, IDService)
  }])
