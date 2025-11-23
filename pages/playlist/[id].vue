<template>
  <div>
    <h2 class="centerblock__h2">{{ playlistTitle }}</h2>
    
    <div class="centerblock__content playlist-content">
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
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const playlistId = route.params.id

const playlists = {
  '1': { title: 'Плейлист дня', filter: 'day' },
  '2': { title: '100 танцевальных хитов', filter: 'dance' },
  '3': { title: 'Инди-заряд', filter: 'indie' }
}

const playlistInfo = playlists[playlistId] || { title: 'Плейлист', filter: '' }
const playlistTitle = ref(playlistInfo.title)

// Динамический заголовок
useHead({
  title: `${playlistTitle.value} | Skypro.Music`,
})

// Загружаем треки (пока заглушка)
const { data: response } = await useFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/"
)

const playlistTracks = computed(() => {
  const allTracks = response.value?.data || []
  // Здесь будет логика фильтрации треков по плейлисту
  // Пока возвращаем все треки
  return allTracks.slice(0, 10) // первые 10 для примера
})
</script>