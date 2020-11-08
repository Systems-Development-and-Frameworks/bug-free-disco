import { shallowMount } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import Home from "@/components/Home.vue";
import News from "@/components/News.vue";

describe("Home.vue", () => {
  let newsList = [];
  it("empty list", () => {
    const wrapper = shallowMount(Home, {
      propsData: {
        newsListInput: newsList
      }
    });
    expect(wrapper.text()).toMatch("The list is empty :(");
  });

  describe("pre filled news list", () => {
    beforeEach(() => {
      newsList = [
        {
          title: "VueJS",
          body: "VueJS is nice",
          votes: 2
        },
        {
          title: "Angular",
          body: "Angular is the best!",
          votes: 1
        },
        {
          title: "Java",
          body: "java is perfect!",
          votes: 0
        }
      ];
    });

    it("not empty list", () => {
      const wrapper = shallowMount(Home, {
        propsData: {
          newsListInput: newsList
        }
      });
      expect(wrapper.findAllComponents(News).length).toBe(3);
    });

    it("change sort order", () => {
      const wrapper = mount(Home, {
        propsData: {
          newsListInput: newsList
        }
      });
      const button = wrapper.find("button");
      button.trigger("click");

      expect(wrapper.vm.sortedNewsList[0].votes).toBe(0);
    });
  });
});
