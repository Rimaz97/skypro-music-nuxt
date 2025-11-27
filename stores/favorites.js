import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favoriteTracks: [],
  }),

  actions: {
    toggleFavorite(track) {
      const trackId = track._id || track.id;
      const index = this.favoriteTracks.findIndex(
        (t) => (t._id || t.id) === trackId
      );

      if (index > -1) {
        // Удаляем из избранного
        this.favoriteTracks.splice(index, 1);
      } else {
        // Добавляем в избранное
        this.favoriteTracks.push(track);
      }
    },

    isFavorite(track) {
      const trackId = track._id || track.id;
      return this.favoriteTracks.some((t) => (t._id || t.id) === trackId);
    },

    // Загрузка избранного из localStorage
    loadFavorites() {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("favoriteTracks");
        if (saved) {
          this.favoriteTracks = JSON.parse(saved);
        }
      }
    },

    // Сохранение избранного в localStorage
    saveFavorites() {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "favoriteTracks",
          JSON.stringify(this.favoriteTracks)
        );
      }
    },
  },
});
