import { usePlayerStore } from "~/stores/player";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  // Инициализируем плеер в самом начале
  const initPlayer = (element) => {
    if (!element) {
      console.error("Плеера нет :(");
      return false;
    }
    playerStore.setAudioRef(element);
    console.log("Плеер инициализирован успешно");
    return true;
  };

  // Воспроизводим трек
  const playTrack = async (track) => {
    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return false;
    }

    try {
      console.log("Начинаем воспроизведение трека:", track);

      // ИСПРАВЛЕНИЕ: сравниваем по _id, а не по id
      const currentTrackId =
        playerStore.currentTrack?._id || playerStore.currentTrack?.id;
      const newTrackId = track._id || track.id;

      if (currentTrackId === newTrackId) {
        console.log("Тот же трек, переключаем воспроизведение");
        playerStore.togglePlay();
        return true;
      }

      // Устанавливаем текущий трек
      playerStore.setCurrentTrack(track);

      // Используем track_file из API или audioUrl из моковых данных
      const audioUrl = track.track_file || track.audioUrl;
      if (!audioUrl) {
        console.error("У трека нет аудиофайла:", track);
        return false;
      }

      console.log("Устанавливаем источник аудио:", audioUrl);

      // Пауза перед установкой нового источника
      playerStore.audioRef.pause();
      playerStore.setPlaying(false);

      // Устанавливаем новый источник
      playerStore.audioRef.src = audioUrl;

      // Сбрасываем прогресс
      playerStore.setProgress(0);

      // Добавляем задержку чтобы избежать AbortError
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Воспроизводим
      await playerStore.audioRef.play();
      playerStore.setPlaying(true);

      console.log("Трек успешно воспроизводится");
      return true;
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      playerStore.setPlaying(false);
      return false;
    }
  };

  // Обновляем прогресс трека
  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return;
    const currentTime = playerStore.audioRef.currentTime;
    const duration = playerStore.audioRef.duration;

    if (duration && !isNaN(duration)) {
      const progress = (currentTime / duration) * 100;
      playerStore.setProgress(progress);
    }
  };

  // Обработчик окончания трека
  const handleTrackEnd = () => {
    playerStore.setPlaying(false);
    playerStore.setProgress(0);
  };

  // Перематываем
  const seekTo = (percentage) => {
    if (!playerStore.audioRef || !playerStore.currentTrack) return;
    const duration = playerStore.audioRef.duration;
    if (duration && !isNaN(duration)) {
      const newTime = (percentage / 100) * duration;
      playerStore.audioRef.currentTime = newTime;
      playerStore.setProgress(percentage);
    }
  };

  // Меняем громкость
  const updateVolume = () => {
    if (!playerStore.audioRef) return;
    playerStore.audioRef.volume = playerStore.volume / 100;
  };

  return {
    initPlayer,
    playTrack,
    handleTimeUpdate,
    handleTrackEnd,
    seekTo,
    updateVolume,
  };
}
