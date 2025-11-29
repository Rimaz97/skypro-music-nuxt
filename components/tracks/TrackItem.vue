<template>
  <div class="playlist__item" @click="playThisTrack">
    <div class="playlist__track track">
      <div class="track__title">
        <div class="track__title-image">
          <svg class="track__title-svg">
            <use xlink:href="/img/icon/sprite.svg#icon-note" />
          </svg>
          <div
            v-if="isCurrentTrack"
            class="track__status-dot"
            :class="{ pulsating: isPlaying }"
          />
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="#">
            {{ track.name || "Без названия" }}
            <span v-if="track.remix" class="track__title-span">{{
              track.remix
            }}</span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__author-link" href="#">{{
          track.author || "Неизвестен"
        }}</a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="#">{{
          track.album || "Без альбома"
        }}</a>
      </div>
      <div class="track__time">
        <svg
          class="track__time-svg"
          :class="{
            active: isFavorite,
            loading: favoritesStore.loading,
          }"
          @click.stop="toggleFavorite"
        >
          <use xlink:href="/img/icon/sprite.svg#icon-like" />
        </svg>
        <span class="track__time-text">{{
          formatDuration(track.duration_in_seconds)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from "~/stores/player";
import { useFavoritesStore } from "~/stores/favorites";
import { useUserStore } from "~/stores/user";
import { useAudioPlayer } from "~/composables/useAudioPlayer";
import { computed } from "vue";

const playerStore = usePlayerStore();
const favoritesStore = useFavoritesStore();
const userStore = useUserStore();
const { initPlayer, playTrack } = useAudioPlayer();

const props = defineProps({
  track: {
    type: Object,
    required: true,
  },
  playlist: {
    type: Array,
    default: () => [],
  },
});

// УБЕРИТЕ ЭТОТ БЛОК - избранное загружается автоматически через layout
// onMounted(() => {
//   if (userStore.isAuthenticated && favoritesStore.favoriteTracks.length === 0) {
//     favoritesStore.fetchFavorites().catch(console.error);
//   }
// });

// Остальной код без изменений...
const isCurrentTrack = computed(() => {
  const currentTrackId =
    playerStore.currentTrack?._id || playerStore.currentTrack?.id;
  const trackId = props.track._id || props.track.id;
  return currentTrackId === trackId;
});

const isPlaying = computed(() => {
  return isCurrentTrack.value && playerStore.isPlaying;
});

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.track);
});

const formatDuration = (seconds) => {
  const totalSeconds = Math.floor(Number(seconds) || 0);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const playThisTrack = async (event) => {
  if (event.target.closest(".track__time-svg")) {
    return;
  }

  if (props.playlist && props.playlist.length > 0) {
    playerStore.setPlaylist(props.playlist);
  }

  if (!playerStore.audioRef) {
    initPlayer();
  }

  playTrack(props.track);
};

const toggleFavorite = async () => {
  await favoritesStore.toggleFavorite(props.track);
};
</script>

<style scoped>
/* Стили остаются без изменений */
.track__time-svg.loading {
  opacity: 0.5;
  cursor: not-allowed;
}

.playlist__item {
  width: 100%;
  display: block;
  margin-bottom: 12px;
  cursor: pointer;
}

.playlist__track {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  transition: background-color 0.3s ease;
}

.playlist__track:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.track__title {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 447px;
}

.track__title-image {
  width: 51px;
  height: 51px;
  padding: 16px;
  background: #313131;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 17px;
  position: relative;
  flex-shrink: 0;
}

.track__title-svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.track__title-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track__title-span {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e4e4e;
}

.track__author {
  width: 321px;
  display: flex;
  justify-content: flex-start;
}

.track__author-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track__album {
  width: 245px;
}

.track__album-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #696969;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track__time {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.track__time-svg {
  width: 14px;
  height: 12px;
  margin-right: 17px;
  fill: transparent;
  stroke: #696969;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.track__time-svg.active {
  fill: #b672ff;
  stroke: #b672ff;
}

.track__time-svg:hover {
  stroke: #acacac;
}

.track__time-text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: #696969;
  flex-shrink: 0;
}

.track__status-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: #b672ff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.track__status-dot.pulsating {
  opacity: 1;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
}
</style>
