import jwtDecode from 'jwt-decode'
let cookieparser = require('cookieparser')

export function getUserFromCookie(req) {
  if (!req.headers.cookie) return
  if (req.headers.cookie) {
    const parser = cookieparser.parse(req.headers.cookie)
    const accessTokenCookie = parser.token
    if (!accessTokenCookie) return
    return accessTokenCookie
  }
}
