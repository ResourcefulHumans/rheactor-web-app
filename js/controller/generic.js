import {HttpProgress} from '../util/http'
import {appLogger} from '../util/logger'
import {JSONLD} from '../util/jsonld'
import _defaults from 'lodash/defaults'
import {HttpProblem} from 'rheactor-models'

const logger = appLogger()

/**
 * @param {object} Model
 * @param {object} callbacks
 * @param {String} createRelation
 * @param {GenericAPIService} genericService
 */
export function GenericController (Model, callbacks, createRelation, genericService) {
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
        return genericService.create(JSONLD.getRelLink(createRelation, index), callbacks.onSubmit(data))
          .then((result) => {
            vm.p.success()
            callbacks.success(result, vm)
          })
      })
      .catch(err => HttpProblem.is(err), httpProblem => {
        vm.p.error(httpProblem)
      })
  }
  return vm
}
