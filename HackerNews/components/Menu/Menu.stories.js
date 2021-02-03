// Menu.stories.js

import Menu from './Menu'

export default {
  title: 'Components/Menu',
  component: Menu
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Menu },
  template: '<Menu :msg="msg" @click="switchSortOrder"/>'
})

export const Default = Template.bind({})
Default.args = {}
