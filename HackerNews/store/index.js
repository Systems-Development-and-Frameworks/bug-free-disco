
import cookie from 'cookie'

export const actions = {
  nuxtServerInit (store, context) {
    const { req } = context.ssrContext
    if (!req) { return } // static site generation
    if (!req.headers.cookie) { return }
    const parsedCookies = cookie.parse(req.headers.cookie)
    const token = parsedCookies['apollo-token']
    if (!token) { return }
    store.commit('auth/SET_TOKEN', token)
  }
}
