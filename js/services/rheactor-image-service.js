import {GenericAPIService} from '../services/generic'
import {URIValueType, URIValue} from 'rheactor-value-objects'
import {Index} from 'rheactor-models'
import {accept} from '../util/http'

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-image-service#Upload')
const mimeType = 'application/vnd.resourceful-humans.rheactor-image-service.v1+json'

/**
 * @param $http
 * @param {APIService} apiService
 */
export class RHeactorImageServiceService extends GenericAPIService {
  constructor ($http, apiService, imageServiceURI) {
    super($http, apiService, $context)
    URIValueType(imageServiceURI, ['RHeactorImageServiceService', 'imageServiceURI:URIValue'])
    this.imageServiceURI = imageServiceURI
  }

  /**
   * @returns {URIValue}
   */
  getUploadURI () {
    return this.$http({
      method: 'GET',
      url: this.imageServiceURI.slashless().append('/index').toString(),
      data: '',
      headers: accept(mimeType).headers
    })
      .then(({data}) => Index.fromJSON(data))
      .then(index => index.$links.filter(l => l.subject.equals($context)))
      .spread(uploadLink => uploadLink.href)
  }

  static get $context () {
    return $context
  }

  static get mimeType () {
    return mimeType
  }
}
