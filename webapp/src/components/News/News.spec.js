import { shallowMount } from "@vue/test-utils";
import News from "@/components/News/News.vue";

describe("News.vue", () => {
  it("renders title", () => {
    const news = {
      title: "TestTitle",
      body: "",
      votes: 0
    };
    const wrapper = shallowMount(News, {
      propsData: { news }
    });
    expect(wrapper.text()).toMatch("TestTitle");
  });
});
