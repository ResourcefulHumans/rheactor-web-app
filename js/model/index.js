'use strict'

/* globals angular */

const Login = require('./login')
const PasswordChange = require('./password-change')

angular
  .module('RHeactorModelModule', [])
  .service('LoginModel', () => {
    return Login
  })
  .service('PasswordChangeModel', () => {
    return PasswordChange
  })
