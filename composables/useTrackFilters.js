import { useFiltersStore } from "~/stores/filters";
import { useSortStore } from "~/stores/sort";

export const useTrackFilters = (tracks) => {
  const filtersStore = useFiltersStore();
  const sortStore = useSortStore();

  // Отфильтрованные и отсортированные треки
  const filteredTracks = computed(() => {
    let result = tracks.value;

    // Применяем текстовый поиск, если есть
    if (filtersStore.searchQuery) {
      const query = filtersStore.searchQuery.toLowerCase();
      result = result.filter(
        (track) =>
          track.name?.toLowerCase().includes(query) ||
          track.author?.toLowerCase().includes(query) ||
          track.album?.toLowerCase().includes(query)
      );
    }

    // Применяем фильтр по автору (множественный выбор)
    if (filtersStore.selectedFilters.author.length > 0) {
      result = result.filter((track) =>
        filtersStore.selectedFilters.author.includes(track.author)
      );
    }

    // Применяем фильтр по году (множественный выбор)
    if (filtersStore.selectedFilters.year.length > 0) {
      result = result.filter((track) => {
        const year = track.release_date?.split("-")[0] || "Неизвестно";
        return filtersStore.selectedFilters.year.includes(year);
      });
    }

    // Применяем фильтр по жанру (множественный выбор)
    if (filtersStore.selectedFilters.genre.length > 0) {
      result = result.filter((track) => {
        if (Array.isArray(track.genre)) {
          // Объединяем массив жанров в строку и приводим к нижнему регистру
          const genreString = track.genre.join(" ").toLowerCase();
          return filtersStore.selectedFilters.genre.some((selectedGenre) =>
            genreString.includes(selectedGenre.toLowerCase())
          );
        } else if (track.genre) {
          return filtersStore.selectedFilters.genre.includes(
            track.genre.toLowerCase().trim()
          );
        }
        return false;
      });
    }

    // Применяем сортировку
    result = sortTracks(result, sortStore.currentSort);

    return result;
  });

  // Функция сортировки треков
  const sortTracks = (tracks, sortType) => {
    const sortedTracks = [...tracks];

    switch (sortType) {
      case "newest":
        // От новых к старым (по дате релиза)
        return sortedTracks.sort((a, b) => {
          const dateA = new Date(a.release_date || 0);
          const dateB = new Date(b.release_date || 0);
          return dateB - dateA;
        });

      case "oldest":
        // От старых к новым (по дате релиза)
        return sortedTracks.sort((a, b) => {
          const dateA = new Date(a.release_date || 0);
          const dateB = new Date(b.release_date || 0);
          return dateA - dateB;
        });

      case "default":
      default:
        // По умолчанию - порядок из API
        return sortedTracks;
    }
  };

  // Списки для фильтров
  const authorItems = computed(() => {
    if (!tracks.value || tracks.value.length === 0) return [];
    const items = new Set();
    tracks.value.forEach((track) => {
      if (track.author) {
        items.add(track.author);
      }
    });
    return Array.from(items).sort((a, b) => a.localeCompare(b));
  });

  const yearItems = computed(() => {
    if (!tracks.value || tracks.value.length === 0) return [];
    const items = new Set();
    tracks.value.forEach((track) => {
      const year = track.release_date?.split("-")[0] || "Неизвестно";
      items.add(year);
    });
    return Array.from(items).sort((a, b) => b.localeCompare(a));
  });

  const genreItems = computed(() => {
    if (!tracks.value || tracks.value.length === 0) return [];
    const items = new Set();
    tracks.value.forEach((track) => {
      if (Array.isArray(track.genre)) {
        track.genre.forEach((g) => g && items.add(g.toLowerCase().trim()));
      } else if (track.genre) {
        items.add(track.genre.toLowerCase().trim());
      }
    });
    return Array.from(items).sort((a, b) => a.localeCompare(b));
  });

  return {
    filteredTracks,
    authorItems,
    yearItems,
    genreItems,
  };
};
