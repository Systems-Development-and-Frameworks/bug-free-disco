// News.stories.js

import News from './News'

export default {
  title: 'Components/News',
  component: News
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { News },
  template:
    '<News :news="news" @upVote="updateItem" @downVote="updateItem" @remove="removeItem" />'
})

export const Default = Template.bind({})
Default.args = {
  news: {
    title: 'VueJS',
    body: 'VueJS is nice',
    votes: 0
  }
}
