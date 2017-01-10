import {URIValue, EmailValue} from 'rheactor-value-objects'

const $context = new URIValue('https://github.com/RHeactor/nucleus/wiki/JsonLD#PasswordChange')

export class PasswordChangeModel {
  constructor (email) {
    EmailValue(email)
    this.email = email
    this.$context = $context
  }

  static get $context () {
    return $context
  }
}
