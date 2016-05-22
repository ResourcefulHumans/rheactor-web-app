'use strict'

const Registration = require('../model/registration')
const genericController = require('./generic')

module.exports = function (app) {
  app
    .config(['$stateProvider', ($stateProvider) => {
      $stateProvider
        .state('register', {
          url: '/register',
          public: true,
          templateUrl: '/view/registration.html',
          controllerAs: 'vm',
          controller: ['RegistrationService', genericController.bind(null, Registration, {}, 'register')]
        })
    }])
}
