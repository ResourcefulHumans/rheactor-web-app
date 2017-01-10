import {GenericAPIService} from './generic'
import {Status} from 'rheactor-models'
import {JSONLD} from '../util/jsonld'

/**
 * @param $http
 * @param {APIService} apiService */
export class StatusService extends GenericAPIService {
  constructor ($http, apiService) {
    super($http, apiService, Status.$context)
  }

  /**
   * @return {Status}
   */
  status () {
    return this.apiService
      .index()
      .then((index) => super.get(JSONLD.getRelLink('status', index) + '?t=' + Date.now()))
  }
}
