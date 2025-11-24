<template>
  <div>
    <h2 class="centerblock__h2">{{ categoryName || "Категория" }}</h2>

    <!-- Состояние загрузки -->
    <div v-if="pending" class="content__playlist playlist">
      <div class="loading">Загрузка треков категории...</div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="content__playlist playlist">
      <div class="error">Ошибка загрузки треков: {{ error.message }}</div>
    </div>

    <!-- Список треков категории -->
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
          v-for="track in categoryTracks"
          :key="track._id"
          :track="track"
          :playlist="categoryTracks"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const categoryId = route.params.id;

// Определяем категории
const categories = {
  rock: { title: "Рок музыка", genres: ["rock", "alternative", "indie rock"] },
  pop: { title: "Поп музыка", genres: ["pop", "dance pop", "electropop"] },
  jazz: { title: "Джаз", genres: ["jazz", "smooth jazz", "bossa nova"] },
  classical: {
    title: "Классическая музыка",
    genres: ["classical", "orchestral"],
  },
  hiphop: { title: "Хип-хоп", genres: ["hip-hop", "rap", "trap"] },
  electronic: {
    title: "Электронная музыка",
    genres: ["electronic", "house", "techno", "dubstep"],
  },
};

const categoryInfo = categories[categoryId] || {
  title: "Категория",
  genres: [],
};
const categoryName = ref(categoryInfo.title);

// Динамический заголовок страницы
useHead({
  title: `${categoryName.value} | Skypro.Music`,
});

// Ленивая загрузка треков категории - не критичные данные
const {
  data: response,
  pending,
  error,
} = await useLazyFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/",
  {
    lazy: true,
    server: false, // Загружаем только на клиенте, так как категории не критичны для SEO
    transform: (data) => {
      // Фильтруем треки по жанрам категории
      if (!data.data) return [];

      const filteredTracks = data.data.filter((track) => {
        if (!track.genre) return false;

        // Проверяем, соответствует ли жанр трека категории
        const trackGenres = Array.isArray(track.genre)
          ? track.genre
          : [track.genre];
        return trackGenres.some((genre) =>
          categoryInfo.genres.some((catGenre) =>
            genre.toLowerCase().includes(catGenre.toLowerCase())
          )
        );
      });

      return filteredTracks.slice(0, 20); // Ограничиваем количество треков
    },
  }
);

const categoryTracks = computed(() => response.value || []);

// Обновляем заголовок при изменении названия категории
watch(categoryName, (newName) => {
  useHead({
    title: `${newName} | Skypro.Music`,
  });
});

// Логируем загрузку категории для отладки
onMounted(() => {
  console.log(
    `Загружена категория: ${categoryName.value}`,
    categoryTracks.value.length
  );
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
