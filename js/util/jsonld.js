'use strict'

const logger = require('./logger')
const _filter = require('lodash/filter')
const ApplicationError = require('rheactor-value-objects/dist/errors/application')

/**
 * @param {Function} filterFunc
 * @param {object} model to fetch the relation from
 * @returns {Promise.<String>}
 */
const getLink = (filterFunc, model) => {
  let matched = _filter(model.$links, filterFunc)
  if (!matched.length) {
    logger.apiWarning('Link not found …', model.$links)
    throw new ApplicationError('Relation link not found …')
  }
  if (matched.length > 1) {
    logger.apiWarning('Too many links matched …', matched)
    throw new ApplicationError('Too many relation links matched')
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
  try {
    return getLink((link) => {
      return link.rel === relation
    }, model)
  } catch (err) {
    logger.apiWarning('Tried to find relation', relation, 'on', model)
    throw err
  }
}

/**
 * @param {String} context
 * @param {object} model Optional model, to fetch the relation from
 * @returns {Promise.<String>}
 */
const getListLink = (context, model) => {
  try {
    return getLink((link) => {
      return link.list && link.context === context
    }, model)
  } catch (err) {
    logger.apiWarning('Tried to find link', context, 'on', model)
    throw err
  }
}

module.exports = {
  getLink,
  getRelLink,
  getListLink
}
