
import cookie from 'cookie'
import jwtDecode from 'jwt-decode'

export const actions = {
  nuxtServerInit (store, context) {
    const { req } = context.ssrContext
    if (!req) { return } // static site generation
    if (!req.headers.cookie) { return }
    const parsedCookies = cookie.parse(req.headers.cookie)
    const token = parsedCookies['apollo-token']
    if (!token) { return }
    store.commit('auth/SET_TOKEN', token)
    const decoded = jwtDecode(token)
    console.log(decoded)
    if (decoded) {
      store.commit('auth/SET_USER_ID', decoded.id)
      store.commit('auth/SET_USER_NAME', decoded.name)
    }
  }
}
