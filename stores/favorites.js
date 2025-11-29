import { defineStore } from "pinia";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    favoriteTracks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchFavorites() {
      const userStore = useUserStore();

      if (!userStore.isAuthenticated || !userStore.token) {
        this.favoriteTracks = [];
        return;
      }

      if (this.loading) return;

      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_URL}/catalog/track/favorite/all/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            try {
              await userStore.refreshToken();
              const retryResponse = await fetch(
                `${API_URL}/catalog/track/favorite/all/`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${userStore.token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!retryResponse.ok) {
                throw new Error(`Ошибка сервера: ${retryResponse.status}`);
              }

              const data = await retryResponse.json();
              this.favoriteTracks = data.data || [];
              return;
            } catch {
              throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
            }
          }
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        this.favoriteTracks = data.data || [];
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        this.error = error.message;

        if (error.message.includes("Сессия истекла")) {
          userStore.clearUser();
        }
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(track) {
      const userStore = useUserStore();

      if (!userStore.isAuthenticated) {
        this.error = "Для добавления в избранное необходимо авторизоваться";
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        const trackId = track._id || track.id;
        const isCurrentlyFavorite = this.isFavorite(track);

        if (isCurrentlyFavorite) {
          await this.removeFromFavorites(trackId);
          this.favoriteTracks = this.favoriteTracks.filter(
            (t) => (t._id || t.id) !== trackId
          );
        } else {
          await this.addToFavorites(trackId);
          this.favoriteTracks.push(track);
        }

        return true;
      } catch (error) {
        console.error("Error toggling favorite:", error);
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async addToFavorites(trackId) {
      const userStore = useUserStore();

      const response = await fetch(
        `${API_URL}/catalog/track/${trackId}/favorite/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          try {
            await userStore.refreshToken();
            const retryResponse = await fetch(
              `${API_URL}/catalog/track/${trackId}/favorite/`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${userStore.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!retryResponse.ok) {
              throw new Error(`Ошибка сервера: ${retryResponse.status}`);
            }

            return await retryResponse.json();
          } catch {
            throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
          }
        }
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      return await response.json();
    },

    async removeFromFavorites(trackId) {
      const userStore = useUserStore();

      const response = await fetch(
        `${API_URL}/catalog/track/${trackId}/favorite/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          try {
            await userStore.refreshToken();
            const retryResponse = await fetch(
              `${API_URL}/catalog/track/${trackId}/favorite/`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${userStore.token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!retryResponse.ok) {
              throw new Error(`Ошибка сервера: ${retryResponse.status}`);
            }

            return await retryResponse.json();
          } catch {
            throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
          }
        }
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      return await response.json();
    },

    isFavorite(track) {
      const trackId = track._id || track.id;
      return this.favoriteTracks.some((t) => (t._id || t.id) === trackId);
    },
  },
});
