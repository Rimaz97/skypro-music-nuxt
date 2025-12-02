import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    // Текущий трек
    currentTrack: null,
    // Список треков
    playlist: [],
    // Исходный порядок плейлиста (для отключения shuffle)
    originalPlaylist: [],
    // Индекс текущего трека
    currentTrackIndex: -1,
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
    // Режим перемешивания
    isShuffled: false,
    // Режим зацикливания
    isLoop: false,
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track) {
      this.currentTrack = track;
      this.showPlayer = true;

      // Находим индекс текущего трека в плейлисте
      if (this.playlist.length > 0) {
        this.currentTrackIndex = this.playlist.findIndex(
          (t) => (t._id || t.id) === (track._id || track.id)
        );
      }
    },

    // Установить плейлист
    setPlaylist(tracks) {
      this.playlist = tracks;
      this.originalPlaylist = [...tracks]; // Сохраняем исходный порядок
    },

    // Следующий трек
    nextTrack() {
      if (this.playlist.length === 0) return;

      let nextIndex;

      if (this.isShuffled) {
        // В режиме shuffle - случайный трек
        nextIndex = Math.floor(Math.random() * this.playlist.length);
      } else {
        // Обычный порядок
        nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
      }

      this.currentTrackIndex = nextIndex;
      this.currentTrack = this.playlist[nextIndex];
      this.progress = 0;

      // Если плеер играл, продолжаем воспроизведение
      if (this.isPlaying && this.audioRef) {
        this.playCurrentTrack();
      }
    },

    // Предыдущий трек
    previousTrack() {
      if (this.playlist.length === 0) return;

      let prevIndex;

      if (this.isShuffled) {
        // В режиме shuffle - случайный трек
        prevIndex = Math.floor(Math.random() * this.playlist.length);
      } else {
        // Обычный порядок
        prevIndex = this.currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = this.playlist.length - 1;
      }

      this.currentTrackIndex = prevIndex;
      this.currentTrack = this.playlist[prevIndex];
      this.progress = 0;

      // Если плеер играл, продолжаем воспроизведение
      if (this.isPlaying && this.audioRef) {
        this.playCurrentTrack();
      }
    },

    // Переключение режима перемешивания
    toggleShuffle() {
      this.isShuffled = !this.isShuffled;

      if (this.isShuffled && this.playlist.length > 0) {
        // Сохраняем текущий порядок и перемешиваем
        this.originalPlaylist = [...this.playlist];
        this.shufflePlaylist();
      } else if (!this.isShuffled && this.originalPlaylist.length > 0) {
        // Восстанавливаем исходный порядок
        this.playlist = [...this.originalPlaylist];
        // Обновляем индекс текущего трека
        if (this.currentTrack) {
          this.currentTrackIndex = this.playlist.findIndex(
            (t) =>
              (t._id || t.id) ===
              (this.currentTrack._id || this.currentTrack.id)
          );
        }
      }
    },

    // Перемешивание плейлиста
    shufflePlaylist() {
      const shuffled = [...this.playlist];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.playlist = shuffled;

      // Обновляем индекс текущего трека после перемешивания
      if (this.currentTrack) {
        this.currentTrackIndex = this.playlist.findIndex(
          (t) =>
            (t._id || t.id) === (this.currentTrack._id || this.currentTrack.id)
        );
      }
    },

    // Переключение режима зацикливания
    toggleLoop() {
      this.isLoop = !this.isLoop;
    },

    // Воспроизведение текущего трека
    playCurrentTrack() {
      if (!this.audioRef || !this.currentTrack) return;

      const audioUrl =
        this.currentTrack.track_file || this.currentTrack.audioUrl;
      if (!audioUrl) return;

      this.audioRef.src = audioUrl;
      this.audioRef
        .play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error) => {
          console.error("Ошибка воспроизведения:", error);
          this.isPlaying = false;
        });
    },

    setProgress(progress) {
      this.progress = progress;
    },

    setVolume(volume) {
      this.volume = volume;
      if (this.audioRef) {
        this.audioRef.volume = volume / 100;
      }
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
      this.currentTrackIndex = -1;
      this.isPlaying = false;
      this.progress = 0;
    },
  },
});
