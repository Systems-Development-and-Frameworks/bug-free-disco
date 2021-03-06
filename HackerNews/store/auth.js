import jwtDecode from 'jwt-decode'
import { SET_USER_ID, SET_USER_NAME, SET_TOKEN, SET_LOADING } from './mutation-types'
import { LOGIN, SIGNUP } from '~/graphql/mutations'

export const state = () => ({
  loading: false,
  token: null,
  currentUserID: null,
  currentUserName: null
})

export const mutations = {
  [SET_TOKEN] (state, token) {
    state.token = token
  },
  [SET_USER_ID] (state, userID) {
    state.currentUserID = userID
  },
  [SET_USER_NAME] (state, userName) {
    state.currentUserName = userName
  },
  [SET_LOADING] (state, loading) {
    state.loading = loading
  }
}

export const getters = {
  isLoggedIn (state) {
    return !!state.token
  },
  userName (state) {
    return state.currentUserName
  },
  isSidebaToggle (state) {
    return state.toggleSidebar
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
        const decoded = jwtDecode(token)
        if (decoded) {
          await commit(SET_USER_ID, decoded.id)
          await commit(SET_USER_NAME, decoded.name)
        }
        return true
      }
    } catch (error) {
      console.log(error.message)
      if (error.message === 'GraphQL error: No matching user founded in the DB' || error.message === 'GraphQL error: Wrong credentials') { return false }
      throw error
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async logout ({ commit }) {
    commit(SET_LOADING, true)
    this.$apolloHelpers.onLogout()
    await commit(SET_TOKEN, null)
    await commit(SET_USER_ID, null)
    await commit(SET_USER_NAME, null)
    commit(SET_LOADING, false)
  },
  async signup ({ commit }, { name, email, password, apollo }) {
    commit(SET_LOADING, true)

    const res = await apollo.mutate({
      mutation: SIGNUP,
      variables: { name, email, password }
    })
    const token = res.data.signup
    commit(SET_LOADING, false)
    return !!token
  }
}
