'use strict'

const Login = require('./login')

require('angular')
  .module('RHeactorModelModule', [])
  .service('LoginModel', () => {
    return Login
  })
