// Footer.stories.js

import Footer from './Footer'

export default {
  title: 'Components/Footer',
  component: Footer
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Footer },
  template: '<Footer :msg="msg" @click="switchSortOrder"/>'
})

export const Default = Template.bind({})
Default.args = {}
