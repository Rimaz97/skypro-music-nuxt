import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    // Текущий трек
    currentTrack: null,
    // Список треков
    playlist: [],
    // Играет ли сейчас
    isPlaying: false,
    // Прогресс воспроизведения (0-100)
    progress: 0,
    // Громкость (0-100)
    volume: 50,
    // Ссылка на аудиотег
    audioRef: null,
    // Показывать ли плеер
    showPlayer: false,
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track) {
      console.log("Store: Устанавливаем текущий трек:", track?.name || track?.title);
      this.currentTrack = track;
      this.showPlayer = true; // Показываем плеер при выборе трека
      console.log("Store: Текущий трек установлен:", this.currentTrack?.name || this.currentTrack?.title);
    },

    // Остальные действия остаются без изменений
    setPlaylist(tracks) {
      this.playlist = tracks;
    },

    setProgress(progress) {
      this.progress = progress;
    },

    setVolume(volume) {
      this.volume = volume;
    },

    setPlaying(isPlaying) {
      console.log("Store: Устанавливаем состояние воспроизведения:", isPlaying);
      this.isPlaying = isPlaying;
    },

    setAudioRef(element) {
      if (!element) {
        console.error("Передан пустой audio элемент");
        return;
      }
      console.log("Store: Устанавливаем audioRef");
      this.audioRef = element;
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100;
      }
    },

    togglePlay() {
      console.log("Store: togglePlay вызван");
      console.log("Store: audioRef:", this.audioRef);
      console.log("Store: currentTrack:", this.currentTrack);

      if (!this.audioRef || !this.currentTrack) {
        console.error("AudioRef или текущий трек не установлен");
        return;
      }

      try {
        if (this.isPlaying) {
          console.log("Store: Пауза");
          this.audioRef.pause();
          this.isPlaying = false;
        } else {
          console.log("Store: Воспроизведение");
          // Добавляем небольшую задержку чтобы избежать AbortError
          setTimeout(() => {
            this.audioRef
              .play()
              .then(() => {
                this.isPlaying = true;
                console.log("Store: Воспроизведение успешно начато");
              })
              .catch((error) => {
                console.error("Ошибка воспроизведения:", error);
                this.isPlaying = false;
              });
          }, 100);
        }
      } catch (error) {
        console.error("Ошибка переключения воспроизведения:", error);
      }
    },

    // Скрыть плеер
    hidePlayer() {
      this.showPlayer = false;
      this.currentTrack = null;
      this.isPlaying = false;
      this.progress = 0;
    },
  },
});