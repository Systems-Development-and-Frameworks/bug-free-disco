import { SET_USER, SET_TOKEN, SET_LOADING } from './mutation-types'
import { LOGIN } from '~/graphql/mutations'

export const state = () => ({
  loading: false,
  token: null,
  currentUser: null
})

export const mutations = {
  [SET_TOKEN] (state, token) {
    state.token = token
  },
  [SET_USER] (state, user) {
    state.user = user
  },
  [SET_LOADING] (state, loading) {
    state.loading = loading
  }
}

export const getters = {
  isLoggedIn (state) {
    return !!state.token
  }
}

export const actions = {
  async login ({ commit }, { email, password, apollo }) {
    commit(SET_LOADING, true)
    try {
      const res = await apollo.mutate({
        mutation: LOGIN,
        variables: { email, password }
      })
      const token = res.data.login

      if (token) {
        this.$apolloHelpers.onLogin(token)
        await commit(SET_TOKEN, token)
        return true
      }
    } catch (error) {
      console.log(error.message)
      if (error.message === 'GraphQL error: No matching user founded in the DB' || error.message === 'GraphQL error: Wrong credentials') { return false }
      throw error
    } finally {
      commit(SET_LOADING, false)
    }
  }
}
