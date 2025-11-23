<template>
  <div>
    <h2 class="centerblock__h2">Мой плейлист</h2>
    
    <div v-if="favoriteTracks.length === 0" class="content__playlist playlist">
      <div class="loading">Нет избранных треков</div>
    </div>

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
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '~/stores/favorites';

// Динамический заголовок для страницы избранного
useHead({
  title: "Мой плейлист | Skypro.Music",
});

const favoritesStore = useFavoritesStore();

// Загружаем избранное при загрузке страницы
onMounted(() => {
  favoritesStore.loadFavorites();
});

const favoriteTracks = computed(() => {
  return favoritesStore.favoriteTracks;
});
</script>