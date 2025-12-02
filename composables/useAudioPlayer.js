import { usePlayerStore } from "~/stores/player";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  // Создаем аудиоэлемент
  const createAudioElement = () => {
    if (typeof document === "undefined") return null;

    const audioElement = document.createElement("audio");
    audioElement.crossOrigin = "anonymous";
    audioElement.preload = "metadata";

    // Настраиваем обработчики
    audioElement.addEventListener("timeupdate", () => {
      if (!audioElement.duration || isNaN(audioElement.duration)) return;
      const progress = (audioElement.currentTime / audioElement.duration) * 100;
      playerStore.setProgress(progress);
    });

    audioElement.addEventListener("ended", () => {
      playerStore.setPlaying(false);
      playerStore.setProgress(0);
      if (playerStore.playlist.length > 0) {
        playerStore.nextTrack();
      }
    });

    audioElement.addEventListener("loadedmetadata", () => {
      if (playerStore.isPlaying) {
        audioElement.play().catch(console.error);
      }
    });

    audioElement.style.display = "none";
    document.body.appendChild(audioElement);

    return audioElement;
  };

  // Инициализируем плеер
  const initPlayer = () => {
    if (!playerStore.audioRef) {
      const audioElement = createAudioElement();
      if (audioElement) {
        playerStore.setAudioRef(audioElement);
        return true;
      }
    }
    return !!playerStore.audioRef;
  };

  // Воспроизводим трек
  const playTrack = async (track, playlist = []) => {
    try {
      // Инициализируем плеер
      if (!playerStore.audioRef) {
        const initialized = initPlayer();
        if (!initialized) return false;
      }

      const currentTrackId = playerStore.currentTrack?._id;
      const newTrackId = track._id;

      // Если это тот же трек, переключаем воспроизведение
      if (currentTrackId === newTrackId) {
        if (playerStore.isPlaying) {
          playerStore.audioRef.pause();
          playerStore.setPlaying(false);
        } else {
          await playerStore.audioRef.play();
          playerStore.setPlaying(true);
        }
        return true;
      }

      // Устанавливаем плейлист
      if (playlist.length > 0) {
        playerStore.setPlaylist(playlist);
      }

      // Устанавливаем текущий трек
      playerStore.setCurrentTrack(track);

      // Получаем URL трека
      const audioUrl = track.track_file;
      if (!audioUrl) {
        console.error("У трека нет аудиофайла:", track);
        return false;
      }

      // Пауза текущего воспроизведения
      if (playerStore.audioRef) {
        playerStore.audioRef.pause();
      }

      // Устанавливаем новый источник
      playerStore.audioRef.src = audioUrl;
      playerStore.setProgress(0);

      // Воспроизводим
      await playerStore.audioRef.play();
      playerStore.setPlaying(true);

      return true;
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      playerStore.setPlaying(false);
      return false;
    }
  };

  // Перематываем
  const seekTo = (percentage) => {
    if (!playerStore.audioRef || !playerStore.audioRef.duration) return;
    const time = (percentage / 100) * playerStore.audioRef.duration;
    playerStore.audioRef.currentTime = time;
    playerStore.setProgress(percentage);
  };

  // Обновляем громкость
  const updateVolume = (volume) => {
    if (!playerStore.audioRef) return;
    playerStore.setVolume(volume);
    playerStore.audioRef.volume = volume / 100;
  };

  return {
    initPlayer,
    playTrack,
    seekTo,
    updateVolume,
  };
}
