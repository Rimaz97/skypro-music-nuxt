<template>
  <div>
    <h2 class="centerblock__h2">Мой плейлист</h2>

    <!-- Состояние загрузки -->
    <div v-if="pending" class="content__playlist playlist">
      <div class="loading">Загрузка избранных треков...</div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="content__playlist playlist">
      <div class="error">
        Ошибка загрузки избранных треков: {{ error.message }}
      </div>
    </div>

    <!-- Нет избранных треков -->
    <div
      v-else-if="favoriteTracks.length === 0"
      class="content__playlist playlist"
    >
      <div class="loading">Нет избранных треков</div>
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

// Динамический заголовок для страницы избранного
useHead({
  title: "Мой плейлист | Skypro.Music",
});

const favoritesStore = useFavoritesStore();

// Используем ленивую загрузку для дополнительных данных (например, рекомендаций)
// Это пример - в реальном приложении здесь могла бы быть загрузка рекомендованных треков
const {
  data: recommendedTracks,
  pending,
  error,
} = await useLazyFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/",
  {
    lazy: true,
    server: false, // Загружаем только на клиенте
  }
);

// Загружаем избранное при загрузке страницы
onMounted(() => {
  favoritesStore.loadFavorites();
});

const favoriteTracks = computed(() => {
  return favoritesStore.favoriteTracks;
});

// Логика для работы с рекомендованными треками (пример)
const setupRecommendedTracks = () => {
  if (recommendedTracks.value) {
    console.log(
      "Рекомендованные треки загружены:",
      recommendedTracks.value.data?.length
    );
    // Здесь можно добавить логику для работы с рекомендованными треками
  }
};

watch(recommendedTracks, () => {
  setupRecommendedTracks();
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
</style>
