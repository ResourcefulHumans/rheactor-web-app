import {HttpProblem} from 'rheactor-models'

export function httpProblemfromHttpError (httpError, detail) {
  const data = httpError.data || {}
  if (data.$context === HttpProblem.$context.toString()) {
    detail += ' (' + data.detail + ')'
    return new HttpProblem(data.type, data.title, data.status, detail)
  }
  const statusText = httpError.status > 1 ? httpError.statusText : 'Connection failed'
  const url = 'https://github.com/RHeactor/nucleus/wiki/HttpProblem#' +
    httpError.status +
    '?statusText=' + encodeURIComponent(statusText) +
    '&detail=' + encodeURIComponent(detail)
  return new HttpProblem(url, statusText, httpError.status, detail)
}
