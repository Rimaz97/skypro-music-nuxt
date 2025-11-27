import { defineStore } from "pinia";

export const useFiltersStore = defineStore("filters", {
  state: () => ({
    searchQuery: "",
    activeFilter: null,
    selectedFilters: {
      author: [], // Множественный выбор
      year: [], // Тоже множественный выбор!
      genre: [], // Множественный выбор
    },
  }),

  actions: {
    setSearchQuery(query) {
      this.searchQuery = query;
    },

    setActiveFilter(filter) {
      this.activeFilter = this.activeFilter === filter ? null : filter;
    },

    toggleSelectedFilter(type, value) {
      // Для ВСЕХ типов - множественный выбор
      const index = this.selectedFilters[type].indexOf(value);
      if (index > -1) {
        this.selectedFilters[type].splice(index, 1);
      } else {
        this.selectedFilters[type].push(value);
      }
    },

    resetFilters() {
      this.selectedFilters = {
        author: [],
        year: [],
        genre: [],
      };
      this.searchQuery = "";
    },
  },

  getters: {
    hasActiveFilters: (state) => {
      return (
        state.selectedFilters.author.length > 0 ||
        state.selectedFilters.year.length > 0 ||
        state.selectedFilters.genre.length > 0
      );
    },

    filterCounts: (state) => ({
      author: state.selectedFilters.author.length,
      year: state.selectedFilters.year.length,
      genre: state.selectedFilters.genre.length,
    }),
  },
});
