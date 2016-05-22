'use strict'

const HttpProgress = require('../util/http').HttpProgress
const logger = require('../util/logger')
const jsonld = require('../util/jsonld')
const _defaults = require('lodash/defaults')
const HttpProblem = require('../model/http-problem')

/**
 * @param {object} Model
 * @param {object} callbacks
 * @param {String} createRelation
 * @param {GenericApiService} genericService
 */
module.exports = function (Model, callbacks, createRelation, genericService) {
  callbacks = _defaults(callbacks,
    {
      success: () => {
        logger.appNotice('No success handler defined for generic controller for' + Model.$context)
      }
    })
  let vm = {}

  vm.p = new HttpProgress()

  vm.submit = (data) => {
    if (vm.p.$active) {
      return
    }
    vm.p.activity()
    genericService.apiService.index()
      .then((index) => {
        return genericService.create(jsonld.getRelLink(createRelation, index), new Model(data))
          .then((result) => {
            vm.p.success()
            callbacks.success(result, vm)
          })
      })
      .catch(HttpProblem, (httpProblem) => {
        vm.p.error(httpProblem)
      })
  }
  return vm
}
