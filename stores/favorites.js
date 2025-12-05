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
              // Исправляем структуру ответа API
              this.favoriteTracks = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                ? data.data
                : [];
              return;
            } catch {
              throw new Error("Сессия истекла. Пожалуйста, войдите снова.");
            }
          }
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        // API возвращает данные в разном формате, нормализуем
        this.favoriteTracks = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        this.error = error.message;
        this.favoriteTracks = []; // Сбрасываем на пустой массив

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

        console.log("toggleFavorite:", {
          trackId,
          isCurrentlyFavorite,
          currentFavorites: this.favoriteTracks.length,
        });

        if (isCurrentlyFavorite) {
          await this.removeFromFavorites(trackId);
          // Обновляем локальный список
          this.favoriteTracks = this.favoriteTracks.filter(
            (t) => (t._id || t.id) !== trackId
          );
        } else {
          await this.addToFavorites(trackId);
          // Добавляем трек в локальный список
          this.favoriteTracks = [...this.favoriteTracks, track];
        }

        console.log(
          "toggleFavorite успешно, новые избранные:",
          this.favoriteTracks.length
        );
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
      // Проверяем, что favoriteTracks - массив
      if (!Array.isArray(this.favoriteTracks)) {
        console.error(
          "favoriteTracks не является массивом:",
          this.favoriteTracks
        );
        return false;
      }
      return this.favoriteTracks.some((t) => (t._id || t.id) === trackId);
    },
  },
});
