<template>
  <div class="playlist__item">
    <div class="playlist__track track">
      <div class="track__title">
        <div class="track__title-image" @click="$emit('play', track)">
          <svg class="track__title-svg">
            <use xlink:href="/img/icon/sprite.svg#icon-note"></use>
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="#">
            {{ track.title }}
            <span class="track__title-span">{{ track.remix }}</span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__author-link" href="#">{{ track.artist }}</a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="#">{{ track.album }}</a>
      </div>
      <div class="track__time">
        <svg
          class="track__time-svg"
          :class="{ active: isFavorite }"
          @click="$emit('toggle-favorite', track)"
        >
          <use xlink:href="/img/icon/sprite.svg#icon-like"></use>
        </svg>
        <span class="track__time-text">{{ track.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  track: {
    type: Object,
    required: true,
  },
});

defineEmits(["play", "toggle-favorite"]);

// Временная заглушка для избранного
const isFavorite = ref(false);
</script>
