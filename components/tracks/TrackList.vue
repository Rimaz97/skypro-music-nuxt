<template>
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
defineProps({
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

<style scoped>
.centerblock__content {
  display: flex;
  flex-direction: column;
  margin-left: 294px;
}

.content__title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.content__playlist {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 673px;
}

.playlist-title__col {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 2px;
  color: #696969;
  text-transform: uppercase;
}

.playlist-title__svg {
  width: 12px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.col01 {
  width: 447px;
}

.col02 {
  width: 321px;
}

.col03 {
  width: 245px;
}

.col04 {
  width: 60px;
  text-align: end;
}

@media (max-width: 1440px) {
  .centerblock__content {
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
  }
}

@media (max-width: 991px) {
  .centerblock__content {
    width: 100%;
    margin: 20px 0 0 0;
  }
  
  .content__playlist {
    max-height: 50vh;
  }
}
</style>