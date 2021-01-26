import { shallowMount, createLocalVue } from '@vue/test-utils'

import Home from '@/components/Home/Home.vue'
import News from '@/components/News/News.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
const currentUserID = "1"

describe('Home', () => {
  let actions
  let getters
  let store

  store = new Vuex.Store({
    modules: {
      auth: {
        namespaced: true,
        state: () => ({
          loading: false,
          currentUserID: currentUserID,
          token: null,
        }),
        actions,
        getters,
      },
    },
  })


  it('empty list', () => {
    const data = {
      newsList: []
    }
    const wrapper = shallowMount(Home, {
      localVue,
      store,
      data: () => data
    })
    expect(wrapper.text()).toMatch('The list is empty :(')
  })

  describe('pre filled news list', () => {
    let data
    beforeEach(() => {
      data = {newsList: [
        {
          id: "1",
          title: 'VueJS',
          body: 'VueJS is nice',
          votes: 2,
          author: {
            id: '5',
            name: 'saddddddad',
            email: 'asdddddad'
          },
          voters: []
        },
        {
          id: '1',
          title: 'Angular',
          body: 'Angular is the best!',
          votes: 1,
          author: {
            id: '3',
            name: 'sdadadad',
            email: 'asddddad'
          },
          voters: []
        },
        {
          id: "3",
          title: 'Java',
          body: 'java is perfect!',
          votes: 0,
          author: {
            id: '2',
            name: 'sadad',
            email: 'asdad'
          },
          voters: []
        }
      ]}
    })

    it('not empty list', () => {
      const wrapper = shallowMount(Home, {
        localVue,
        store,
        data: () => data
      })
      
      expect(wrapper.findAllComponents(News).length).toBe(3)
    })

    it('change sort order', () => {
      const wrapper = shallowMount(Home, {
        localVue,
        store,
        data: () => data
      })
      const button = wrapper.find('#switchOrderBtn')
      button.trigger('click')

      expect(wrapper.vm.sortedNewsList[0].id).toBe("3")
    })

  })
})
