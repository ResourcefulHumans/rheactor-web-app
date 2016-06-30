'use strict'

const Login = require('./login')
const PasswordChange = require('./password-change')

require('angular')
  .module('RHeactorModelModule', [])
  .service('LoginModel', () => {
    return Login
  })
  .service('PasswordChangeModel', () => {
    return PasswordChange
  })
