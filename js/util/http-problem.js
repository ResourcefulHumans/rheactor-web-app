import {HttpProblem} from 'rheactor-models'
import {URIValue} from 'rheactor-value-objects'

/**
 * Converts a http error to an HttpProblem
 *
 * @param httpError
 * @param detail
 * @returns {HttpProblem}
 */
export function httpProblemfromHttpError (httpError, detail) {
  const data = httpError.data || {}
  if (data && data.$context && data.$context.toString() === HttpProblem.$context.toString()) {
    detail += ' (' + data.detail + ')'
    return new HttpProblem(new URIValue(data.type), data.title, data.status, detail)
  }
  let status = httpError.status
  let statusText = httpError.statusText
  if (status <= 1) {
    status = 503 // Service Unavailable
    statusText = 'Connection failed'
  }
  const url = 'https://github.com/RHeactor/nucleus/wiki/HttpProblem#' +
    httpError.status +
    '?statusText=' + encodeURIComponent(statusText) +
    '&detail=' + encodeURIComponent(detail)
  return new HttpProblem(new URIValue(url), statusText, status, detail)
}

/**
 * To be used in Angular contexts, where errors are normally supressed
 *
 * @param {Error} err
 * @returns {HttpProblem}
 */
export function httpProblemfromException (err) {
  const url = 'https://github.com/RHeactor/nucleus/wiki/Exception#' +
    '?statusText=' + encodeURIComponent(err.message) +
    '&detail=' + encodeURIComponent(err)
  return new HttpProblem(new URIValue(url), err.message, 500, JSON.stringify(err))
}
