<template>
  <div>
    <h2 class="centerblock__h2">Мой плейлист</h2>

    <!-- Состояние загрузки -->
    <div v-if="favoritesStore.loading" class="content__playlist playlist">
      <div class="loading">Загрузка избранных треков...</div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="favoritesStore.error" class="content__playlist playlist">
      <div class="error">
        Ошибка загрузки избранных треков: {{ favoritesStore.error }}
      </div>
    </div>

    <!-- Нет избранных треков -->
    <div
      v-else-if="favoriteTracks.length === 0"
      class="content__playlist playlist"
    >
      <div class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3 class="empty-title">Нет избранных треков</h3>
        <p class="empty-description">
          Добавляйте треки в избранное, нажимая на сердечко
        </p>
      </div>
    </div>

    <!-- Список избранных треков -->
    <div v-else class="centerblock__content playlist-content">
      <div class="content__title playlist-title">
        <div class="playlist-title__col col01">Трек</div>
        <div class="playlist-title__col col02">Исполнитель</div>
        <div class="playlist-title__col col03">Альбом</div>
        <div class="playlist-title__col col04">
          <svg class="playlist-title__svg">
            <use xlink:href="/img/icon/sprite.svg#icon-watch" />
          </svg>
        </div>
      </div>
      <div class="content__playlist playlist">
        <TracksTrackItem
          v-for="track in favoriteTracks"
          :key="track._id"
          :track="track"
          :playlist="favoriteTracks"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from "~/stores/favorites";
import { useUserStore } from "~/stores/user";

useHead({
  title: "Мой плейлист | Skypro.Music",
});

const favoritesStore = useFavoritesStore();
const userStore = useUserStore();

// Загружаем избранное при загрузке страницы
onMounted(() => {
  if (userStore.isAuthenticated) {
    favoritesStore.fetchFavorites();
  }
});

// Перезагружаем избранное при появлении пользователя
watch(
  () => userStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      favoritesStore.fetchFavorites();
    } else {
      favoritesStore.favoriteTracks = [];
    }
  }
);

const favoriteTracks = computed(() => {
  return favoritesStore.favoriteTracks;
});
</script>

<style scoped>
.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #fff;
  font-family: "Montserrat", sans-serif;
}

.error {
  color: #ff6b6b;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #696969;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #ffffff;
}

.empty-description {
  font-size: 16px;
  line-height: 1.5;
}
</style>
