import { shallowMount, mount, createLocalVue  } from '@vue/test-utils'
import News from '@/components/News/News.vue'
import Vuex from 'vuex'
import Vue from 'vue'

const localVue = createLocalVue()
localVue.use(Vuex)
const currentUserID = "1"


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


let newsTemplate;
beforeEach(() => {
  newsTemplate = {id: '',
  title: '',
  body: '',
  votes: 0,
  author: {
    id: '',
    name: '',
    email: ''
  },
  voters: []}
})

it('upvote failed', async () => {
  const mutate = jest.fn().mockResolvedValue({data: { }})
const mocks = {$apollo: {
mutate
}}
  const upVote = jest.spyOn(News.methods, 'upVote')
  const news = newsTemplate
  const wrapper = shallowMount(News, {
    localVue,
    store,
    mocks,
    propsData: {
      news:  news
    }
  })
  const button = wrapper.find('#upvoteBtn')
  await button.trigger('click')
  await Vue.nextTick()
  expect(mutate).toBeCalled()
  expect(upVote).toHaveBeenCalledTimes(1)
  expect(wrapper.find('.error').text()).toContain(
    'Upvote request failed!'
  )
})

  it('should correctly trigger when the upvote button is clicked', async () => {
    const mutate = jest.fn().mockResolvedValue({data: {
      upvote: {post: 'somePostValue'}
    }})
const mocks = {$apollo: {
  mutate
}}
    const upVote = jest.spyOn(News.methods, 'upVote')
    const news = newsTemplate
    const wrapper = shallowMount(News, {
      localVue,
      store,
      mocks,
      propsData: {
        news:  news
      }
    })
    const button = wrapper.find('#upvoteBtn')
    button.trigger('click')
    await Vue.nextTick()
    expect(mutate).toBeCalled()
    expect(upVote).toBeCalled()
    expect(news.votes === 1)
  })

  it('downvote failed', async () => {
    const mutate = jest.fn().mockResolvedValue({data: {  }})
  const mocks = {$apollo: {
  mutate
  }}
    const downVote = jest.spyOn(News.methods, 'downVote')
    const news = newsTemplate
    const wrapper = shallowMount(News, {
      localVue,
      store,
      mocks,
      propsData: {
        news:  news
      }
    })
    const button = wrapper.find('#downvoteBtn')
    await button.trigger('click')
    await Vue.nextTick()
    expect(mutate).toBeCalled()
    expect(downVote).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.error').text()).toContain(
      'Downvote request failed!'
    )
  })

  

  it('should correctly trigger when the downvote button is clicked', async () => {
    const mutate = jest.fn().mockResolvedValue({data: {
      downvote: {post: 'somePostValue'}
    }})
const mocks = {$apollo: {
  mutate
}}
    const downVote = jest.spyOn(News.methods, 'downVote')
    const news = newsTemplate
    const wrapper = shallowMount(News, {
      localVue,
      store,
      mocks,
      propsData: {
        news:  news
      }
    })
    const button = wrapper.find('#downvoteBtn')
    button.trigger('click')
    await Vue.nextTick()
    expect(mutate).toBeCalled()
    expect(downVote).toBeCalled()
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
