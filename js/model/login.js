import {URIValue, EmailValueType} from 'rheactor-value-objects'
import {String as StringValue} from 'tcomb'

const $context = new URIValue('https://github.com/RHeactor/nucleus/wiki/JsonLD#Login')

export class LoginModel {
  constructor (email, password) {
    EmailValueType(email, ['LoginModel', 'email:EmailValue'])
    StringValue(password, ['LoginModel', 'password:String'])
    this.email = email
    this.password = password
    this.$context = $context
  }

  toJSON () {
    return {
      email: this.email.toString(),
      password: this.password
    }
  }

  static get $context () {
    return $context
  }
}
