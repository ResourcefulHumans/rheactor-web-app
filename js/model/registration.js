import {URIValue, EmailValue} from 'rheactor-value-objects'
import {String as StringValue} from 'tcomb'

const $context = new URIValue('https://github.com/RHeactor/nucleus/wiki/JsonLD#Registration')

export class RegistrationModel {
  constructor (email, password, firstname, lastname) {
    EmailValue(email)
    StringValue(password)
    StringValue(firstname)
    StringValue(lastname)
    this.email = email
    this.password = password
    this.firstname = firstname
    this.lastname = lastname
    this.$context = $context
  }

  static get $context () {
    return $context
  }
}
