/* global describe, it */

import {AppButtonDirective} from '../../js/directives/app-button'
import {HttpProgress} from '../../js/util/http'
import {expect} from 'chai'
import Promise from 'bluebird'

describe('AppButton', () => {
  it('should be enabled if a form is provided and it is valid', () => {
    const b = AppButtonDirective
    const scope = {
      progress: new HttpProgress(),
      form: {
        $invalid: false
      }
    }
    b.link(scope)
    expect(scope.isDisabled()).to.equal(false)
    expect(scope.isBlocked()).to.equal(false)
    expect(scope.isPristine()).to.equal(true)
    expect(scope.isProgress()).to.equal(false)
    expect(scope.isSuccess()).to.equal(false)
    expect(scope.isError()).to.equal(false)
  })
  it('should be disabled if a form is provided and it is invalid', () => {
    const b = AppButtonDirective
    const scope = {
      progress: new HttpProgress(),
      form: {
        $invalid: true
      }
    }
    b.link(scope)
    expect(scope.isDisabled()).to.equal(true)
    expect(scope.isBlocked()).to.equal(true)
    expect(scope.isPristine()).to.equal(false)
    expect(scope.isProgress()).to.equal(false)
    expect(scope.isSuccess()).to.equal(false)
    expect(scope.isError()).to.equal(false)
  })
  it('should be disabled if a form is provided and it is pristine', () => {
    const b = AppButtonDirective
    const scope = {
      progress: new HttpProgress(),
      form: {
        $pristine: true
      }
    }
    b.link(scope)
    expect(scope.isDisabled()).to.equal(true)
    expect(scope.isBlocked()).to.equal(true)
    expect(scope.isPristine()).to.equal(false)
    expect(scope.isProgress()).to.equal(false)
    expect(scope.isSuccess()).to.equal(false)
    expect(scope.isError()).to.equal(false)
  })
  it('should be disabled during http activity', () => {
    const b = AppButtonDirective
    const scope = {
      progress: new HttpProgress().activity()
    }
    b.link(scope)
    expect(scope.isDisabled()).to.equal(true)
    expect(scope.isBlocked()).to.equal(false)
    expect(scope.isPristine()).to.equal(false)
    expect(scope.isProgress()).to.equal(true)
    expect(scope.isSuccess()).to.equal(false)
    expect(scope.isError()).to.equal(false)
  })
  it('should  show error on http error', done => {
    const b = AppButtonDirective
    let scope
    const p1 = new Promise((resolve, reject) => {
      scope = {
        progress: new HttpProgress(msg => {
          expect(msg).to.equal('some msg')
          resolve()
        }).error('some msg')
      }
    })
    const p2 = new Promise((resolve, reject) => {
      b.link(scope)
      expect(scope.isDisabled(), 'It should not be disabled').to.equal(false)
      expect(scope.isBlocked(), 'It should not be blocked').to.equal(false)
      expect(scope.isPristine(), 'It should not be pristine').to.equal(false)
      expect(scope.isProgress(), 'It should not be progress').to.equal(false)
      expect(scope.isSuccess(), 'It should not be success').to.equal(false)
      expect(scope.isError(), 'It should be error').to.equal(true)
      resolve()
    })
    Promise.join(p1, p2).then(() => done())
  })
  it('should show success on http success', () => {
    const b = AppButtonDirective
    const scope = {
      progress: new HttpProgress().success()
    }
    b.link(scope)
    expect(scope.isDisabled(), 'It should not be disabled').to.equal(false)
    expect(scope.isBlocked(), 'It should not be blocked').to.equal(false)
    expect(scope.isPristine(), 'It should not be pristine').to.equal(false)
    expect(scope.isProgress(), 'It should not be progress').to.equal(false)
    expect(scope.isSuccess(), 'It should be success').to.equal(true)
    expect(scope.isError(), 'It should not be error').to.equal(false)
  })
  describe('click', () => {
    it('should handle clicks', done => {
      const b = AppButtonDirective
      const scope = {
        click: (progress) => {
          expect(progress).to.be.instanceof(HttpProgress)
          done()
        }
      }
      b.link(scope)
      scope.executeClick()
    })
    it('should handle clicks with passed args', done => {
      const b = AppButtonDirective
      const scope = {
        click: (progress, arg) => {
          expect(arg).to.equal('foo')
          done()
        },
        clickArgument: 'foo'
      }
      b.link(scope)
      scope.executeClick()
    })
    it('should handle clicks with bound scope', done => {
      const b = AppButtonDirective
      const context = {}
      const scope = {
        click: function (progress) {
          expect(this).to.equal(context)
          done()
        },
        clickBindThis: context
      }
      b.link(scope)
      scope.executeClick()
    })
  })
})
