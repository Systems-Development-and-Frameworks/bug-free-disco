import { shallowMount, mount, createLocalVue  } from '@vue/test-utils'
import News from '@/components/News/News.vue'
import Vuex from 'vuex'
import Vue from 'vue'

const localVue = createLocalVue()
localVue.use(Vuex)
const currentUserID = "1"

const newsTemplate = {id: '',
title: '',
body: '',
votes: 0,
author: {
  id: '',
  name: '',
  email: ''
},
voters: []}


describe('News', () => {
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


  it('should correctly trigger when the upvote button is clicked', async () => {
    const upVote = jest.spyOn(News.methods, 'upVote')
    const news = newsTemplate
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    const button = wrapper.find('#upvoteBtn')
    button.trigger('click')
    await Vue.nextTick()
    expect(upVote).toHaveBeenCalledTimes(1)
  })

  it('should correctly trigger when the downvote button is clicked', async () => {
    const downVote = jest.spyOn(News.methods, 'downVote')
    const news = newsTemplate
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    const button = wrapper.find('#downvoteBtn')
    button.trigger('click')
    await Vue.nextTick()
    expect(downVote).toHaveBeenCalledTimes(1)
  })

  it('should correctly trigger when the remove button is clicked', async () => {
    const remove = jest.spyOn(News.methods, 'remove')
    const news = newsTemplate
    news.author.id = currentUserID
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    const button = wrapper.find('#removeBtn')
    button.trigger('click')
    await Vue.nextTick()
    expect(remove).toHaveBeenCalledTimes(1)
  })



  it('renders title', () => {
    const news = newsTemplate
    news.title = 'TestTitle' 
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    expect(wrapper.text()).toMatch('TestTitle')
  })

  it('should not show button remove and edit', () => {
    const news = newsTemplate
    news.author.id = "not the current ID"
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    expect(wrapper.find('#removeBtn').exists()).toBe(false)
    expect(wrapper.find('#editBtn').exists()).toBe(false)
  })

  it('should show button remove and edit', () => {
    const news = newsTemplate
    news.author.id = currentUserID
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    expect(wrapper.find('#removeBtn').exists()).toBe(true)
    expect(wrapper.find('#editBtn').exists()).toBe(true)
  })

  it('should not show button upvote and downvote', () => {
    const news = newsTemplate
    news.voters.push({id: currentUserID})
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    expect(wrapper.find('#upvoteBtn').exists()).toBe(false)
    expect(wrapper.find('#downvoteBtn').exists()).toBe(false)
  })

  it('should show button upvote and downvote', () => {
    const news = newsTemplate
    news.voters = []
    const wrapper = shallowMount(News, {
      localVue,
      store,
      propsData: {
        news:  news
      }
    })
    expect(wrapper.find('#upvoteBtn').exists()).toBe(true)
    expect(wrapper.find('#downvoteBtn').exists()).toBe(true)
  })
})
