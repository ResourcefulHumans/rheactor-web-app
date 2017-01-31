import {appLogger} from '../util/logger'

const logger = appLogger()

/* global: document */

export class RefreshTokenService {
  constructor (TokenService, ClientStorageService) {
    this.TokenService = TokenService
    this.ClientStorageService = ClientStorageService
    this.refreshing = false
    this.token = undefined
  }

  refresh () {
    if (this.refreshing) return
    if (!this.token) return
    this.refreshing = true
    logger.appInfo('Fetching a new token …')
    this.TokenService.create(this.token)
      .then((token) => {
        logger.appInfo('Recived a new token …')
        this.ClientStorageService.set('token', token)
        this.token = token
        this.refreshing = false
      })
  }

  /**
   * Refreshes the users token, if it is close to expiring
   */
  maybeRefreshToken () {
    if (!this.token) return
    if (Math.max(this.token.exp.getTime() - Date.now(), 0) / (this.token.exp.getTime() - this.token.iat.getTime()) < 0.10) {
      logger.appInfo('Auto refreshing token')
      this.refresh()
    }
  }
}
