// Header.stories.js

import Header from './Header'

export default {
  title: 'Components/Header',
  component: Header
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Header },
  template: '<Header :msg="msg" @click="switchSortOrder"/>'
})

export const Default = Template.bind({})
Default.args = {}
