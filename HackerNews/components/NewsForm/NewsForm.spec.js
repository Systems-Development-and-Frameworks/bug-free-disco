import { shallowMount, createLocalVue } from '@vue/test-utils'
import { ValidationObserver, ValidationProvider } from "vee-validate";
import NewsForm from '@/components/NewsForm/NewsForm.vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.component("ValidationObserver", ValidationObserver);
localVue.component("ValidationProvider", ValidationProvider);

describe('NewsForm.vue', () => {
  it('check error for missing title', () => {
    const wrapper = shallowMount(NewsForm, {
      localVue,
      propsData: {
        newsList: []
      }
    })

    const button = wrapper.find('#createNews')
    button.trigger('submit')

    expect(wrapper.vm.$data.errors[0]).toMatch('Title required.')
  })

  it('check error for duplicate entry', () => {
    const wrapper = shallowMount(NewsForm, {
      localVue,
      propsData: {
        newsList: [
          {
            title: 'TestTitle'
          }
        ]
      }
    })

    wrapper.setData({
        title: 'TestTitle'
    })

    const button = wrapper.find('#createNews')
    button.trigger('submit')

    expect(wrapper.vm.$data.errors[0]).toMatch(
      'A news with title (TestTitle) is already contained in the list of news'
    )
  })
})
