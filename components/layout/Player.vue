<template>
  <div v-if="playerStore.showPlayer" class="bar">
    <div class="bar__content">
      <div class="bar__player-progress" @click="handleProgressClick">
        <div class="progress-bar">
          <div
            class="progress-filled"
            :style="{ width: playerStore.progress + '%' }"
          />
        </div>
      </div>

      <div class="bar__player-block">
        <div class="bar__player player">
          <div class="player__controls">
            <div class="player__btn-prev" @click="previousTrack">
              <svg class="player__btn-prev-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-prev" />
              </svg>
            </div>

            <div class="player__btn-play _btn" @click="handlePlay">
              <img
                v-if="playerStore.isPlaying"
                src="/img/icon/pause.svg"
                alt="Пауза"
                class="player__btn-play-icon"
              >
              <svg v-else class="player__btn-play-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-play" />
              </svg>
            </div>

            <div class="player__btn-next" @click="nextTrack">
              <svg class="player__btn-next-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-next" />
              </svg>
            </div>

            <div
              class="player__btn-repeat _btn-icon"
              :class="{ active: isRepeating }"
              @click="toggleRepeat"
            >
              <svg class="player__btn-repeat-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-repeat" />
              </svg>
            </div>

            <div
              class="player__btn-shuffle _btn-icon"
              :class="{ active: isShuffled }"
              @click="toggleShuffle"
            >
              <svg class="player__btn-shuffle-svg">
                <use xlink:href="/img/icon/sprite.svg#icon-shuffle" />
              </svg>
            </div>
          </div>

          <div class="player__track-play track-play">
            <div class="track-play__contain">
              <div class="track-play__image">
                <svg class="track-play__svg">
                  <use xlink:href="/img/icon/sprite.svg#icon-note" />
                </svg>
              </div>
              <div class="track-play__author">
                <a class="track-play__author-link" href="#">
                  {{
                    playerStore.currentTrack?.artist ||
                    playerStore.currentTrack?.author ||
                    "Выберите трек"
                  }}
                </a>
              </div>
              <div class="track-play__album">
                <a class="track-play__album-link" href="#">
                  {{
                    playerStore.currentTrack?.name ||
                    playerStore.currentTrack?.title ||
                    ""
                  }}
                </a>
              </div>
            </div>

            <div class="track-play__like-dis">
              <div class="track-play__like _btn-icon" @click="toggleLike">
                <svg
                  class="track-play__like-svg"
                  :class="{ active: isTrackLiked }"
                >
                  <use xlink:href="/img/icon/sprite.svg#icon-like" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="bar__volume-block volume">
          <div class="volume__content">
            <div class="volume__image">
              <svg class="volume__svg">
                <use xlink:href="/img/icon/sprite.svg#icon-volume" />
              </svg>
            </div>
            <div class="volume__progress _btn">
              <input
                v-model="playerStore.volume"
                class="volume__progress-line _btn"
                type="range"
                min="0"
                max="100"
                @input="updateVolume"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from "~/stores/player";
import { useAudioPlayer } from "~/composables/useAudioPlayer";

const playerStore = usePlayerStore();
const { seekTo, updateVolume } = useAudioPlayer(); // Убрали неиспользуемые функции

// Локальные состояния для кнопок
const isRepeating = ref(false);
const isShuffled = ref(false);
const isTrackLiked = ref(false);

// Обработчик клика по кнопке play
const handlePlay = () => {
  if (playerStore.currentTrack) {
    playerStore.togglePlay();
  }
};

// Обработчик клика по прогресс-бару
const handleProgressClick = (event) => {
  if (!playerStore.currentTrack) return;

  const progressBar = event.currentTarget;
  const clickPosition = event.offsetX;
  const progressBarWidth = progressBar.offsetWidth;
  const percentage = (clickPosition / progressBarWidth) * 100;

  seekTo(percentage);
};

// Остальные методы (заглушки)
const toggleRepeat = () => {
  isRepeating.value = !isRepeating.value;
};

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value;
};

const nextTrack = () => {
  // Заглушка для следующего трека
};

const previousTrack = () => {
  // Заглушка для предыдущего трека
};

const toggleLike = () => {
  isTrackLiked.value = !isTrackLiked.value;
};
</script>

<style scoped>
.bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(28, 28, 28, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1000;
  flex-shrink: 0;
}

.bar__content {
  display: flex;
  flex-direction: column;
}

.bar__player-progress {
  width: 100%;
  height: 5px;
  background: #2e2e2e;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: #2e2e2e;
  position: relative;
}

.progress-filled {
  height: 100%;
  background: #b672ff;
  transition: width 0.1s;
  position: absolute;
  top: 0;
  left: 0;
}

.bar__player-block {
  height: 73px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.bar__player {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}

.bar__volume-block {
  width: auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex: 1;
  justify-content: flex-end;
}

.player__controls {
  display: flex;
  flex-direction: row;
  padding: 0 27px 0 0;
  align-items: center;
}

.player__btn-prev,
.player__btn-play,
.player__btn-next,
.player__btn-repeat,
.player__btn-shuffle {
  padding: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.player__btn-prev {
  margin-right: 23px;
}

.player__btn-prev-svg {
  width: 15px;
  height: 14px;
  fill: #ffffff;
}

.player__btn-play {
  margin-right: 23px;
}

.player__btn-play-svg {
  width: 22px;
  height: 20px;
  fill: #d9d9d9;
}

.player__btn-next {
  margin-right: 28px;
}

.player__btn-next-svg {
  width: 15px;
  height: 14px;
  fill: #d9d9d9;
}

.player__btn-repeat {
  margin-right: 24px;
}

.player__btn-repeat-svg {
  width: 18px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.player__btn-repeat.active .player__btn-repeat-svg {
  fill: #b672ff;
  stroke: #b672ff;
}

.player__btn-shuffle {
  display: flex;
  align-items: center;
}

.player__btn-shuffle-svg {
  width: 19px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.player__btn-shuffle.active .player__btn-shuffle-svg {
  fill: #b672ff;
  stroke: #b672ff;
}

.player__track-play {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 2;
  justify-content: center;
}

.track-play__contain {
  width: auto;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "image author" "image album";
  align-items: center;
}

.track-play__image {
  width: 51px;
  height: 51px;
  background-color: #313131;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  grid-row: 1;
  grid-column: 1;
  grid-area: image;
  flex-shrink: 0;
}

.track-play__svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.track-play__author {
  grid-row: 1;
  grid-column: 2;
  grid-area: author;
  min-width: 49px;
}

.track-play__author-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-play__album {
  grid-row: 2;
  grid-column: 2;
  grid-area: album;
  min-width: 49px;
}

.track-play__album-link {
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 24px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-play__like-dis {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
}

.track-play__like,
.track-play__dislike {
  padding: 5px;
  cursor: pointer;
}

.track-play__like-svg {
  width: 14px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
  transition: all 0.3s ease;
}

.track-play__like-svg.active {
  fill: #b672ff;
  stroke: #b672ff;
}

.track-play__dislike {
  margin-left: 28.5px;
}

.track-play__dislike-svg {
  width: 14.34px;
  height: 13px;
  fill: transparent;
  stroke: #696969;
}

.volume__content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.volume__image {
  width: 13px;
  height: 18px;
  margin-right: 17px;
}

.volume__svg {
  width: 13px;
  height: 18px;
  fill: transparent;
}

.volume__progress {
  width: 109px;
}

.volume__progress-line {
  width: 109px;
  cursor: pointer;
}
</style>
