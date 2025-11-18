<template>
  <div class="bar">
    <div class="bar__content">
      <div class="bar__player-progress" @click="seekToPosition">
        <div class="progress-bar">
          <div
            class="progress-filled"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <div class="bar__player-block">
        <div class="bar__player player">
          <div class="player__controls">
            <div class="player__btn-prev" @click="previousTrack">
              <svg class="player__btn-prev-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-prev"></use>
              </svg>
            </div>

            <div class="player__btn-play _btn" @click="togglePlay">
              <svg class="player__btn-play-svg">
                <use
                  :xlink:href="
                    isPlaying
                      ? '/img/icon/sprite.svg#icon-pause'
                      : '/img/icon/sprite.svg#icon-play'
                  "
                ></use>
              </svg>
            </div>

            <div class="player__btn-next" @click="nextTrack">
              <svg class="player__btn-next-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-next"></use>
              </svg>
            </div>

            <div
              class="player__btn-repeat _btn-icon"
              @click="toggleRepeat"
              :class="{ active: isRepeating }"
            >
              <svg class="player__btn-repeat-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-repeat"></use>
              </svg>
            </div>

            <div
              class="player__btn-shuffle _btn-icon"
              @click="toggleShuffle"
              :class="{ active: isShuffled }"
            >
              <svg class="player__btn-shuffle-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-shuffle"></use>
              </svg>
            </div>
          </div>

          <div class="player__track-play track-play">
            <div class="track-play__contain">
              <div class="track-play__image">
                <svg class="track-play__svg">
                  <use xlink:href="/img/icon/sprite.svg#icon-note"></use>
                </svg>
              </div>
              <div class="track-play__author">
                <a class="track-play__author-link" href="#">{{
                  currentTrack?.artist || "Выберите трек"
                }}</a>
              </div>
              <div class="track-play__album">
                <a class="track-play__album-link" href="#">{{
                  currentTrack?.title || "Нет трека"
                }}</a>
              </div>
            </div>

            <div class="track-play__like-dis">
              <div class="track-play__like _btn-icon" @click="toggleLike">
                <svg
                  class="track-play__like-svg"
                  :class="{ active: isTrackLiked }"
                >
                  <use xlink:href="/img/icon/sprite.svg#icon-like"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="bar__volume-block volume">
          <div class="volume__content">
            <div class="volume__image">
              <svg class="volume__svg">
                <use xlink:href="/img/icon/sprite.svg#icon-volume"></use>
              </svg>
            </div>
            <div class="volume__progress _btn">
              <input
                class="volume__progress-line _btn"
                type="range"
                min="0"
                max="1"
                step="0.1"
                :value="volume"
                @input="setVolume($event.target.value)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Временная заглушка для плеера - позже добавим полноценную логику
const currentTrack = ref(null); // Оставляем null по умолчанию
const isPlaying = ref(false);
const isRepeating = ref(false);
const isShuffled = ref(false);
const volume = ref(0.5);
const progressPercentage = ref(0);
const isTrackLiked = ref(false);

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  console.log("Toggle play");
};

const toggleRepeat = () => {
  isRepeating.value = !isRepeating.value;
  console.log("Toggle repeat");
};

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value;
  console.log("Toggle shuffle");
};

const nextTrack = () => {
  console.log("Next track");
};

const previousTrack = () => {
  console.log("Previous track");
};

const setVolume = (value) => {
  volume.value = parseFloat(value);
  console.log("Set volume:", volume.value);
};

const toggleLike = () => {
  isTrackLiked.value = !isTrackLiked.value;
  console.log("Toggle like");
};

const seekToPosition = (event) => {
  console.log("Seek to position");
};
</script>
