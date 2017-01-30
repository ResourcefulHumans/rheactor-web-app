import {URIValue, EmailValueType} from 'rheactor-value-objects'
import {String as StringValue} from 'tcomb'

const $context = new URIValue('https://github.com/RHeactor/nucleus/wiki/JsonLD#Registration')

export class RegistrationModel {
  constructor (email, password, firstname, lastname) {
    EmailValueType(email)
    StringValue(password)
    StringValue(firstname)
    StringValue(lastname)
    this.email = email
    this.password = password
    this.firstname = firstname
    this.lastname = lastname
    this.$context = $context
  }

  toJSON () {
    return {
      email: this.email.toString(),
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname
    }
  }

  static get $context () {
    return $context
  }
}
