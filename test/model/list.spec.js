'use strict'

/* global describe, it */

let List = require('../../js/model/list')
let User = require('../../js/model/user')
let Relation = require('../../js/model/relation')
let expect = require('chai').expect

describe('List', function () {
  describe('.hasNext', function () {
    it('should be false if list has only one page', (done) => {
      let l = new List(User.$context, [new User()], 1, 0, 10, [])
      expect(l.hasNext).to.equal(false)
      done()
    })
    it('should be true if list has more pages', (done) => {
      let l = new List(User.$context, [new User()], 11, 0, 10, [new Relation({rel: 'next'})])
      expect(l.hasNext).to.equal(true)
      done()
    })
    it('should be true if list has more pages and list is not the first page', (done) => {
      // context, items, total, offset, itemsPerPage, links
      let l = new List(User.$context, [new User()], 300, 10, 10, [new Relation({rel: 'prev'}), new Relation({rel: 'next'})])
      expect(l.hasNext).to.equal(true)
      done()
    })
  })
  describe('.hasPrev', function () {
    it('should be false if list is on first page', (done) => {
      let l = new List(User.$context, [new User()], 1, 0, 10, [new Relation({rel: 'next'})])
      expect(l.hasPrev).to.equal(false)
      done()
    })
    it('should be true if list is not on first page', (done) => {
      let l = new List(User.$context, [new User()], 11, 10, 10, [new Relation({rel: 'prev'})])
      expect(l.hasPrev).to.equal(true)
      done()
    })
  })
})
