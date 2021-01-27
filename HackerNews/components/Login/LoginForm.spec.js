import { shallowMount, createLocalVue } from '@vue/test-utils'
import LoginForm from '@/components/Login/LoginForm.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LoginForm.vue', () => {
  let actions
  let getters

  const setupWrapper = () => {
    const store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            loading: false,
            currentUser: null,
            token: null
          }),
          actions,
          getters
        }
      }
    })
    return shallowMount(LoginForm, { store, localVue })
  }

  beforeEach(() => {
    getters = {
      isLoggedIn: () => false
    }
    actions = {
      login: jest.fn().mockResolvedValue(true)
    }
  })

  describe('form submit', () => {
    const login = async (wrapper) => {
      wrapper.find('input#email').setValue('test@test.de')
      wrapper.find('input#password').setValue('12345678')
      await wrapper.find('form').trigger('submit')
    }

    it('shows no error', async () => {
      const wrapper = setupWrapper()
      await login(wrapper)
      expect(wrapper.find('.error').exists()).toBe(false)
    })

    describe('when credentials are wrong', () => {
      beforeEach(() => {
        actions.login = jest.fn().mockResolvedValue(false)
      })

      it('shows wrong credentials error', async () => {
        const wrapper = setupWrapper()
        await login(wrapper)
        await localVue.nextTick()
        expect(wrapper.find('.error').text()).toContain(
          'Username or password is invalid'
        )
      })
    })
  })
})
