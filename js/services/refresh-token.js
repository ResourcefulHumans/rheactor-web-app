'use strict'

const logger = require('../util/logger')

/* global: document */

module.exports = function (TokenService, ClientStorageService) {
  function RefreshTokenService () {
    this.refreshing = false
    this.token = undefined
  }

  RefreshTokenService.prototype.refresh = function () {
    const self = this
    if (self.refreshing) return
    if (!self.token) return
    self.refreshing = true
    logger.appInfo('Fetching a new token …')
    TokenService.create(self.token)
      .then((token) => {
        logger.appInfo('Recived a new token …')
        ClientStorageService.set('token', token)
        self.token = token
        self.refreshing = false
      })
  }

  /**
   * Refreshes the users token, if it is close to expiring
   */
  RefreshTokenService.prototype.maybeRefreshToken = function () {
    const self = this
    if (!self.token) return
    if (Math.max(self.token.exp.getTime() - Date.now(), 0) / (self.token.exp.getTime() - self.token.iat.getTime()) < 0.10) {
      logger.appInfo('Auto refreshing token')
      self.refresh()
    }
  }

  return new RefreshTokenService()
}
