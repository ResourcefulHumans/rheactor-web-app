import {HttpProblem} from 'rheactor-models'
import {URIValue} from 'rheactor-value-objects'

export function httpProblemfromHttpError (httpError, detail) {
  const data = httpError.data || {}
  if (data.$context === HttpProblem.$context.toString()) {
    detail += ' (' + data.detail + ')'
    return new HttpProblem(new URIValue(data.type), data.title, data.status, detail)
  }
  const statusText = httpError.status > 1 ? httpError.statusText : 'Connection failed'
  const url = 'https://github.com/RHeactor/nucleus/wiki/HttpProblem#' +
    httpError.status +
    '?statusText=' + encodeURIComponent(statusText) +
    '&detail=' + encodeURIComponent(detail)
  return new HttpProblem(new URIValue(url), statusText, httpError.status, detail)
}

export function httpProblemfromException (err, status = 500) {
  const url = 'https://github.com/RHeactor/nucleus/wiki/HttpProblem#' +
    status +
    '?statusText=' + encodeURIComponent(err.message) +
    '&detail=' + encodeURIComponent(err)
  return new HttpProblem(new URIValue(url), err.message, status, JSON.stringify(err))
}
