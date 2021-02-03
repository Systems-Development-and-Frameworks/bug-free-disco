// Banner.stories.js

import Header from './Banner'

export default {
  title: 'components/Banner',
  component: Banner
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Banner },
  template: '<Banner :msg="msg" @click="switchSortOrder"/>'
})

export const Default = Template.bind({})
Default.args = {}
