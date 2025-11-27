import { defineStore } from "pinia";

export const useSortStore = defineStore("sort", {
  state: () => ({
    // Варианты сортировки: 'default', 'newest', 'oldest'
    currentSort: "default",
  }),

  actions: {
    setSort(sortType) {
      this.currentSort = sortType;
    },
  },
});
