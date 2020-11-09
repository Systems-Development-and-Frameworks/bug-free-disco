import { shallowMount } from "@vue/test-utils";
import NewsForm from "@/components/NewsForm/NewsForm.vue";

describe("NewsForm.vue", () => {
  it("check error for missing title", () => {
    const wrapper = shallowMount(NewsForm, {
      propsData: {
        newsList: [],
      },
    });

    const button = wrapper.find("button");
    button.trigger("submit");

    expect(wrapper.vm.$data.errors[0]).toMatch("Title required.");
  });

  it("check error for duplicate entry", () => {
    const wrapper = shallowMount(NewsForm, {
      propsData: {
        newsList: [
          {
            title: "TestTitle",
            body: "",
          },
        ],
      },
    });

    wrapper.setData({
      news: {
        title: "TestTitle",
        body: "",
      },
    });

    const button = wrapper.find("button");
    button.trigger("submit");

    expect(wrapper.vm.$data.errors[0]).toMatch(
      "A news with title (TestTitle) is already contained in the list of news"
    );
  });
});
