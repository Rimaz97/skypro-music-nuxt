<template>
  <div>
    <h2 class="centerblock__h2">{{ playlistTitle }}</h2>

    <!-- Состояние загрузки -->
    <div v-if="pending" class="content__playlist playlist">
      <div class="loading">Загрузка плейлиста...</div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="content__playlist playlist">
      <div class="error">Ошибка загрузки плейлиста: {{ error.message }}</div>
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
          v-for="track in playlistTracks"
          :key="track._id"
          :track="track"
          :playlist="playlistTracks"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const playlistId = route.params.id;

const playlists = {
  1: { title: "Плейлист дня", filter: "day" },
  2: { title: "100 танцевальных хитов", filter: "dance" },
  3: { title: "Инди-заряд", filter: "indie" },
};

const playlistInfo = playlists[playlistId] || { title: "Плейлист", filter: "" };
const playlistTitle = ref(playlistInfo.title);

// Динамический заголовок
useHead({
  title: `${playlistTitle.value} | Skypro.Music`,
});

// Используем ленивую загрузку для плейлистов
const {
  data: response,
  pending,
  error,
} = await useLazyFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/",
  {
    lazy: true,
    server: false, // Загружаем только на клиенте, так как плейлисты не критичны для SEO
  }
);

const playlistTracks = computed(() => {
  const allTracks = response.value?.data || [];

  // Фильтрация треков по типу плейлиста
  let filteredTracks = allTracks;

  switch (playlistInfo.filter) {
    case "day":
      // Для плейлиста дня - случайные треки
      filteredTracks = [...allTracks]
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
      break;
    case "dance":
      // Для танцевальных хитов - треки с высоким темпом
      filteredTracks = allTracks
        .filter(
          (track) =>
            track.genre?.toLowerCase().includes("dance") ||
            track.genre?.toLowerCase().includes("electronic")
        )
        .slice(0, 15);
      break;
    case "indie":
      // Для инди-заряда - инди треки
      filteredTracks = allTracks
        .filter(
          (track) =>
            track.genre?.toLowerCase().includes("indie") ||
            track.genre?.toLowerCase().includes("alternative")
        )
        .slice(0, 15);
      break;
    default:
      // По умолчанию - первые 10 треков
      filteredTracks = allTracks.slice(0, 10);
  }

  return filteredTracks;
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
