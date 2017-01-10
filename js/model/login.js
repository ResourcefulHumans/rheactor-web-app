import {URIValue, EmailValue} from 'rheactor-value-objects'
import {String as StringValue} from 'tcomb'

const $context = new URIValue('https://github.com/RHeactor/nucleus/wiki/JsonLD#Login')

export class LoginModel {
  constructor (email, password) {
    EmailValue(email)
    StringValue(password)
    this.email = email
    this.password = password
    this.$context = $context
  }

  static get $context () {
    return $context
  }
}
