import { shallowMount, createLocalVue } from '@vue/test-utils'
import SignUpForm from '@/components/SignUp/SignUpForm.vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
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
    return shallowMount(SignUpForm, { store, localVue })
  }

  beforeEach(() => {
    getters = {
      isLoggedIn: () => false
    }
    actions = {
      signup: jest.fn().mockResolvedValue(true)
    }
  })

  describe('form submit', () => {
    const signUp = async (wrapper) => {
      wrapper.find('input#email').setValue('test@test.de')
      wrapper.find('input#password').setValue('12345678')
      wrapper.find('input#rePassword').setValue('12345678')
      wrapper.find('input#name').setValue('Peter Test')
      await wrapper.find('form').trigger('submit')
    }

    it('shows no error', async () => {
      const wrapper = setupWrapper()
      await signUp(wrapper)
      expect(wrapper.find('.error').exists()).toBe(false)
    })

    describe('when registration failed', () => {
      beforeEach(() => {
        actions.signup = jest.fn().mockResolvedValue(false)
      })

      it('shows registration failed', async () => {
        const wrapper = setupWrapper()
        await signUp(wrapper)
        await localVue.nextTick()
        expect(wrapper.find('.error').text()).toContain(
          'Registration failed'
        )
      })
    })
  })

  describe('form submit with wrong rePassword', () => {
    const signUp = async (wrapper) => {
      wrapper.find('input#email').setValue('test@test.de')
      wrapper.find('input#password').setValue('12345678')
      wrapper.find('input#rePassword').setValue('WRONGGG')
      wrapper.find('input#name').setValue('Peter Test')
      await wrapper.find('form').trigger('submit')
    }

    it('shows the rePassword is wrong', async () => {
      const wrapper = setupWrapper()
      await signUp(wrapper)
      await localVue.nextTick()
      expect(wrapper.find('.error').text()).toContain(
        'The password does not match!'
      )
    })
  })
})
