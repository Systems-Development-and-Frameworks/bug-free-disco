import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import NavBar from '@/components/NavBar/NavBar.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
const currentUserID = '1'

describe('NavBar', () => {
  describe('you are logged in', () => {
    let actions

    const getters = {
      isLoggedIn: () => true
    }

    const store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUserID,
            token: null
          }),
          actions,
          getters
        }
      }
    })

    it('Doent Show Login and Signup menu item', () => {
      const wrapper = shallowMount(NavBar, {
        localVue,
        store,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
      expect(wrapper.find('#logSignDiv').exists()).toBe(false)
    })

    it('Show Logout', () => {
      const wrapper = shallowMount(NavBar, {
        localVue,
        store,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
      expect(wrapper.find('#logoutDiv').exists()).toBe(true)
    })
  })

  describe('you are not logged in', () => {
    let actions

    const getters = {
      isLoggedIn: () => false
    }

    const store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUserID,
            token: null
          }),
          actions,
          getters
        }
      }
    })

    it('Show Login and Signup menu item', () => {
      const wrapper = shallowMount(NavBar, {
        localVue,
        store,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
      expect(wrapper.find('#logSignDiv').exists()).toBe(true)
    })

    it('Doent Show Logout', () => {
      const wrapper = shallowMount(NavBar, {
        localVue,
        store,
        stubs: {
          NuxtLink: RouterLinkStub
        }
      })
      expect(wrapper.find('#logoutDiv').exists()).toBe(false)
    })
  })
})
