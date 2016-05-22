'use strict'

const logger = require('./logger')
const _filter = require('lodash/filter')
const Errors = require('../../rheactor-value-objects/errors')

/**
 * @param {Function} filterFunc
 * @param {object} model to fetch the relation from
 * @returns {Promise.<String>}
 */
const getLink = (filterFunc, model) => {
  let matched = _filter(model.$links, filterFunc)
  if (!matched.length) {
    logger.apiWarning('Link not found …', model.$links)
    throw new Errors.ApplicationError('Relation link not found …')
  }
  if (matched.length > 1) {
    logger.apiWarning('Too many links matched …', matched)
    throw new Errors.ApplicationError('Too many relation links matched')
  }
  return matched[0].href
}

/**
 * Find the link for the given relation
 * @param {String} relation
 * @param {object} model Optional model, to fetch the relation from
 * @returns {Promise.<String>}
 */
const getRelLink = (relation, model) => {
  return getLink((link) => {
    return link.rel === relation
  }, model)
}

/**
 * @param {String} context
 * @param {object} model Optional model, to fetch the relation from
 * @returns {Promise.<String>}
 */
const getListLink = (context, model) => {
  return getLink((link) => {
    return link.list && link.context === context
  }, model)
}

module.exports = {
  getLink,
  getRelLink,
  getListLink
}
