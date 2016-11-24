'use strict'

module.exports = ($location, IDService) => {
  /**
   * @param {object} model
   * @returns {string}
   */
  return (model) => {
    if (!model || !model.$id) return
    // Remove to local hostname from the url (if present) to save characters
    return IDService.encode(model.$id.replace($location.absUrl().match(/^(https?:\/\/[^/]+)/)[1], ''))
  }
}
