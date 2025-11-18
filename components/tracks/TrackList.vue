<template>
  <div class="centerblock__content playlist-content">
    <div class="content__title playlist-title">
      <div class="playlist-title__col col01">Трек</div>
      <div class="playlist-title__col col02">Исполнитель</div>
      <div class="playlist-title__col col03">Альбом</div>
      <div class="playlist-title__col col04">
        <svg class="playlist-title__svg">
          <use xlink:href="/img/icon/sprite.svg#icon-watch"></use>
        </svg>
      </div>
    </div>
    <div class="content__playlist playlist">
      <TracksTrackItem
        v-for="track in tracks"
        :key="track.id"
        :track="track"
        @play="playTrack"
        @toggle-favorite="toggleFavorite"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tracks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["play", "toggle-favorite"]);

const playTrack = (track) => {
  emit("play", track);
};

const toggleFavorite = (track) => {
  emit("toggle-favorite", track);
};
</script>
