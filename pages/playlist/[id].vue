<template>
  <div>
    <h2 class="centerblock__h2">{{ playlistTitle }}</h2>

    <div v-if="pending" class="content__playlist playlist">
      <div class="loading">Загрузка плейлиста...</div>
    </div>

    <div v-else-if="error" class="content__playlist playlist">
      <div class="error">Ошибка загрузки плейлиста: {{ error.message }}</div>
    </div>

    <div
      v-else-if="playlistTracks.length === 0"
      class="content__playlist playlist"
    >
      <div class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3 class="empty-title">Плейлист пуст</h3>
        <p class="empty-description">Треки временно недоступны</p>
      </div>
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

// Маппинг текстовых ID на названия и логику фильтрации
const playlistConfigs = {
  day: {
    title: "Плейлист дня",
    filter: (allTracks) =>
      [...allTracks].sort(() => Math.random() - 0.5).slice(0, 20),
  },
  dance: {
    title: "100 танцевальных хитов",
    filter: (allTracks) => {
      const danceTracks = allTracks.filter((track) => {
        const genreString = getGenreString(track);
        return (
          genreString.includes("электронная") ||
          genreString.includes("танцевальн") ||
          genreString.includes("поп") ||
          genreString.includes("диско")
        );
      });

      return danceTracks.length > 0
        ? danceTracks.slice(0, 15)
        : [...allTracks].sort(() => Math.random() - 0.5).slice(0, 15);
    },
  },
  indie: {
    title: "Инди-заряд",
    filter: (allTracks) => {
      const indieTracks = allTracks.filter((track) => {
        const genreString = getGenreString(track);
        return (
          genreString.includes("рок") ||
          genreString.includes("альтернатив") ||
          genreString.includes("инди")
        );
      });

      return indieTracks.length > 0
        ? indieTracks.slice(0, 15)
        : [...allTracks].sort(() => Math.random() - 0.5).slice(0, 15);
    },
  },
  // Старые ссылки для обратной совместимости
  1: {
    title: "Плейлист дня",
    filter: (allTracks) =>
      [...allTracks].sort(() => Math.random() - 0.5).slice(0, 20),
  },
  2: {
    title: "100 танцевальных хитов",
    filter: (allTracks) => {
      const danceTracks = allTracks.filter((track) => {
        const genreString = getGenreString(track);
        return (
          genreString.includes("электронная") ||
          genreString.includes("танцевальн") ||
          genreString.includes("поп") ||
          genreString.includes("диско")
        );
      });

      return danceTracks.length > 0
        ? danceTracks.slice(0, 15)
        : [...allTracks].sort(() => Math.random() - 0.5).slice(0, 15);
    },
  },
  3: {
    title: "Инди-заряд",
    filter: (allTracks) => {
      const indieTracks = allTracks.filter((track) => {
        const genreString = getGenreString(track);
        return (
          genreString.includes("рок") ||
          genreString.includes("альтернатив") ||
          genreString.includes("инди")
        );
      });

      return indieTracks.length > 0
        ? indieTracks.slice(0, 15)
        : [...allTracks].sort(() => Math.random() - 0.5).slice(0, 15);
    },
  },
};

// Получаем конфиг для текущего плейлиста
const playlistConfig = playlistConfigs[playlistId] || {
  title: `Плейлист ${playlistId}`,
  filter: (allTracks) => allTracks.slice(0, 10),
};

const playlistTitle = ref(playlistConfig.title);

// Динамический заголовок
useHead({
  title: `${playlistTitle.value} | Skypro.Music`,
});

// Функция для получения строки жанра
const getGenreString = (track) => {
  if (!track.genre) return "";

  try {
    if (Array.isArray(track.genre)) {
      const genres = [...track.genre];
      return genres
        .map((g) => (g ? g.toString().toLowerCase() : ""))
        .filter((g) => g)
        .join(" ");
    }

    if (typeof track.genre === "string") {
      return track.genre.toLowerCase();
    }

    return String(track.genre).toLowerCase();
  } catch (error) {
    return "";
  }
};

// Загружаем все треки для фильтрации
const {
  data: tracksData,
  pending,
  error,
} = await useFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/"
);

const playlistTracks = computed(() => {
  const allTracks = tracksData.value?.data || [];
  if (allTracks.length === 0) return [];

  return playlistConfig.filter(allTracks);
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
