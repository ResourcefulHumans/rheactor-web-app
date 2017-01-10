import {URIValue} from 'rheactor-value-objects'
import {String as StringValue} from 'tcomb'

const $context = new URIValue('https://github.com/RHeactor/nucleus/wiki/JsonLD#PasswordChangeConfirm')

export class PasswordChangeConfirmModel {
  constructor (email, password) {
    StringValue(password)
    this.password = password
    this.$context = $context
  }

  static get $context () {
    return $context
  }
}
