import {URIValue} from 'rheactor-value-objects'
import {String as StringValue} from 'tcomb'

const $context = new URIValue('https://github.com/RHeactor/nucleus/wiki/JsonLD#PasswordChangeConfirm')

export class PasswordChangeConfirmModel {
  constructor (password) {
    StringValue(password)
    this.password = password
    this.$context = $context
  }

  toJSON () {
    return {
      password: this.password
    }
  }

  static get $context () {
    return $context
  }
}
