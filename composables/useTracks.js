import { ref } from "vue";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useTracks = () => {
  const tracks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchTracks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/catalog/track/all/`);

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      tracks.value = data.data || [];
    } catch (e) {
      error.value = e.message || "Не удалось загрузить треки";
      tracks.value = []; // Сбрасываем треки при ошибке
    } finally {
      loading.value = false;
    }
  };

  return {
    tracks,
    loading,
    error,
    fetchTracks,
  };
};
