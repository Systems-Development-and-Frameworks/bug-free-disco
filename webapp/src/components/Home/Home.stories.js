// Home.stories.js

import Home from "./Home";

export default {
  title: "Components/Home",
  component: Home
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Home },
  template: '<Home :msg="msg" @click="switchSortOrder"/>'
});

export const Default = Template.bind({});
Default.args = {};
