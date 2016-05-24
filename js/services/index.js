'use strict'

const GenericApiService = require('./generic')
const TokenService = require('./token')
const UserService = require('./user')
const StatusService = require('./status')
const ClientStorageService = require('./client-storage')
const IDService = require('./id')

require('angular')
  .module('RHeactorServiceModule', [])
  .factory('LoginService', ['$http', 'APIService', ($http, APIService) => {
    return new GenericApiService($http, APIService)
  }])
  .factory('RegistrationService', ['$http', 'APIService', ($http, APIService) => {
    return new GenericApiService($http, APIService)
  }])
  .factory('PasswordChangeService', ['$http', 'APIService', ($http, APIService) => {
    return new GenericApiService($http, APIService)
  }])
  .factory('PasswordChangeConfirmService', ['$http', 'APIService', ($http, APIService) => {
    return new GenericApiService($http, APIService)
  }])
  .factory('ActivationService', ['$http', 'APIService', ($http, APIService) => {
    return new GenericApiService($http, APIService)
  }])
  .factory('ClientStorageService', ['$window', '$rootScope', 'APIService', ($window, $rootScope, APIService) => {
    return new ClientStorageService($window, $rootScope, APIService)
  }])
  .factory('UserService', ['$http', 'APIService', ($http, APIService) => {
    return new UserService($http, APIService)
  }])
  .factory('StatusService', ['$http', 'APIService', ($http, APIService) => {
    return new StatusService($http, APIService)
  }])
  .factory('TokenService', ['$http', 'APIService', ($http, APIService) => {
    return new TokenService($http, APIService)
  }])
  .factory('IDService', ['$window', ($window) => {
    return new IDService($window)
  }])
