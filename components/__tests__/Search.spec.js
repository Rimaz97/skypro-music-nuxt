import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Search from "../tracks/Search.vue";

describe("Search", () => {
  it("отображает поле поиска", () => {
    const wrapper = mount(Search);
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("emits update:modelValue при вводе текста", async () => {
    const wrapper = mount(Search);
    const input = wrapper.find("input");
    
    await input.setValue("test query");
    
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["test query"]);
  });

  it("emits search событие при вводе текста", async () => {
    const wrapper = mount(Search);
    const input = wrapper.find("input");
    
    await input.setValue("test query");
    
    expect(wrapper.emitted("search")).toBeTruthy();
    expect(wrapper.emitted("search")[0]).toEqual(["test query"]);
  });

  it("очищает поиск при клике на кнопку очистки", async () => {
    const wrapper = mount(Search, {
      props: {
        modelValue: "test value",
      },
    });
    
    const clearButton = wrapper.find(".search-clear");
    await clearButton.trigger("click");
    
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([""]);
    expect(wrapper.emitted("search")[0]).toEqual([""]);
  });

  it("не показывает кнопку очистки когда поле пустое", () => {
    const wrapper = mount(Search, {
      props: {
        modelValue: "",
      },
    });
    
    expect(wrapper.find(".search-clear").exists()).toBe(false);
  });

  it("имеет иконку поиска", () => {
    const wrapper = mount(Search);
    expect(wrapper.find(".search__svg").exists()).toBe(true);
  });
});