// NewsForm.stories.js

import NewsForm from "./NewsForm";

export default {
  title: "Components/NewsForm",
  component: NewsForm
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NewsForm },
  template: '<NewsForm :newsList="newsList" @submit.prevent="checkForm" />'
});

export const Default = Template.bind({});
Default.args = {};
