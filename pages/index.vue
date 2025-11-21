<template>
  <div class="wrapper">
    <div class="container">
      <div class="top-container">
        <div class="top-left">
          <LayoutNavbar />
        </div>

        <div class="top-center">
          <TracksSearch v-model="searchQuery" @search="handleSearch" />
        </div>

        <div class="top-right">
          <div class="sidebar__personal">
            <div class="sidebar__icon" @click="logout">
              <svg>
                <use xlink:href="/img/icon/sprite.svg#logout" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <main class="main">
        <div class="main__centerblock centerblock">
          <h2 class="centerblock__h2">Треки</h2>

          <!-- Фильтры -->
          <div class="centerblock__filter filter">
            <div class="filter__title">Искать по:</div>

            <!-- Фильтр по исполнителю -->
            <div class="filter__wrapper">
              <div
                class="filter__button button-author _btn-text"
                :class="{
                  active: activeFilter === 'author',
                  'filter__button--selected': selectedFilters.author,
                }"
                @click="toggleFilter('author')"
              >
                исполнителю
                <span
                  v-if="selectedFilters.author"
                  class="filter__selected-dot"
                />
              </div>
              <div v-show="activeFilter === 'author'" class="filter__dropdown">
                <ul class="filter__list">
                  <li
                    v-for="item in authorItems"
                    :key="item"
                    class="filter__item"
                    :class="{ active: selectedFilters.author === item }"
                    @click="selectFilter('author', item)"
                  >
                    {{ item }}
                    <span
                      v-if="selectedFilters.author === item"
                      class="filter__check"
                      >✓</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- Фильтр по году -->
            <div class="filter__wrapper">
              <div
                class="filter__button button-year _btn-text"
                :class="{
                  active: activeFilter === 'year',
                  'filter__button--selected': selectedFilters.year,
                }"
                @click="toggleFilter('year')"
              >
                году выпуска
                <span
                  v-if="selectedFilters.year"
                  class="filter__selected-dot"
                />
              </div>
              <div v-show="activeFilter === 'year'" class="filter__dropdown">
                <ul class="filter__list">
                  <li
                    v-for="item in yearItems"
                    :key="item"
                    class="filter__item"
                    :class="{ active: selectedFilters.year === item }"
                    @click="selectFilter('year', item)"
                  >
                    {{ item }}
                    <span
                      v-if="selectedFilters.year === item"
                      class="filter__check"
                      >✓</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- Фильтр по жанру -->
            <div class="filter__wrapper">
              <div
                class="filter__button button-genre _btn-text"
                :class="{
                  active: activeFilter === 'genre',
                  'filter__button--selected': selectedFilters.genre,
                }"
                @click="toggleFilter('genre')"
              >
                жанру
                <span
                  v-if="selectedFilters.genre"
                  class="filter__selected-dot"
                />
              </div>
              <div v-show="activeFilter === 'genre'" class="filter__dropdown">
                <ul class="filter__list">
                  <li
                    v-for="item in genreItems"
                    :key="item"
                    class="filter__item"
                    :class="{ active: selectedFilters.genre === item }"
                    @click="selectFilter('genre', item)"
                  >
                    {{ item }}
                    <span
                      v-if="selectedFilters.genre === item"
                      class="filter__check"
                      >✓</span
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- Кнопка сброса фильтров -->
            <div
              v-if="
                selectedFilters.author ||
                selectedFilters.year ||
                selectedFilters.genre
              "
              class="filter__reset _btn-text"
              @click="resetFilters"
            >
              сбросить фильтры
            </div>
          </div>

          <!-- Показать активные фильтры -->
          <div
            v-if="
              selectedFilters.author ||
              selectedFilters.year ||
              selectedFilters.genre
            "
            class="active-filters"
          >
            <div class="active-filters__title">Активные фильтры:</div>
            <div class="active-filters__list">
              <span v-if="selectedFilters.author" class="active-filter">
                Исполнитель: {{ selectedFilters.author }}
                <span
                  class="active-filter__remove"
                  @click="selectFilter('author', selectedFilters.author)"
                  >×</span
                >
              </span>
              <span v-if="selectedFilters.year" class="active-filter">
                Год: {{ selectedFilters.year }}
                <span
                  class="active-filter__remove"
                  @click="selectFilter('year', selectedFilters.year)"
                  >×</span
                >
              </span>
              <span v-if="selectedFilters.genre" class="active-filter">
                Жанр: {{ selectedFilters.genre }}
                <span
                  class="active-filter__remove"
                  @click="selectFilter('genre', selectedFilters.genre)"
                  >×</span
                >
              </span>
            </div>
          </div>

          <!-- Состояния загрузки и ошибки -->
          <div v-if="loading" class="content__playlist playlist">
            <div class="loading">Загрузка треков...</div>
          </div>

          <div v-else-if="error" class="content__playlist playlist">
            <div class="error">Ошибка загрузки треков: {{ error }}</div>
          </div>

          <!-- Список треков -->
          <div v-else class="centerblock__content playlist-content">
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
                v-for="track in filteredTracks"
                :key="track.id || track._id"
                :track="track"
                @play="handlePlayTrack"
                @toggle-favorite="handleToggleFavorite"
              />
            </div>
          </div>
        </div>

        <LayoutSidebar />
      </main>

      <LayoutPlayer />
    </div>
  </div>
</template>

<script setup>
const tracks = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref("");
const activeFilter = ref(null);
const selectedFilters = ref({
  author: null,
  year: null,
  genre: null,
});

// Загружаем треки на клиенте
const loadTracks = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(
      "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/"
    );
    if (!response.ok) {
      throw new Error("Не удалось получить треки");
    }
    const data = await response.json();
    tracks.value = data.data;
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Ошибка при загрузке треков :(";
  } finally {
    loading.value = false;
  }
};

// Загружаем треки при монтировании компонента
onMounted(() => {
  loadTracks();
});

// Фильтрация по поиску и выбранным фильтрам
const filteredTracks = computed(() => {
  let result = tracks.value;

  // Применяем текстовый поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (track) =>
        track.name?.toLowerCase().includes(query) ||
        track.author?.toLowerCase().includes(query) ||
        track.album?.toLowerCase().includes(query)
    );
  }

  // Применяем фильтр по автору
  if (selectedFilters.value.author) {
    result = result.filter(
      (track) => track.author === selectedFilters.value.author
    );
  }

  // Применяем фильтр по году
  if (selectedFilters.value.year) {
    result = result.filter((track) => {
      const year = track.release_date?.split("-")[0] || "Неизвестно";
      return year === selectedFilters.value.year;
    });
  }

  // Применяем фильтр по жанру
  if (selectedFilters.value.genre) {
    result = result.filter((track) => {
      if (Array.isArray(track.genre)) {
        return track.genre.some(
          (g) => g && g.toLowerCase().trim() === selectedFilters.value.genre
        );
      } else if (track.genre) {
        return track.genre.toLowerCase().trim() === selectedFilters.value.genre;
      }
      return false;
    });
  }

  return result;
});

// Управление фильтрами
const toggleFilter = (filter) => {
  activeFilter.value = activeFilter.value === filter ? null : filter;
};

const selectFilter = (type, value) => {
  // Если выбираем то же значение - снимаем фильтр
  if (selectedFilters.value[type] === value) {
    selectedFilters.value[type] = null;
  } else {
    selectedFilters.value[type] = value;
  }
  activeFilter.value = null; // Закрываем dropdown после выбора
};

// Сброс всех фильтров
const resetFilters = () => {
  selectedFilters.value = {
    author: null,
    year: null,
    genre: null,
  };
  searchQuery.value = "";
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
  return Array.from(items).sort((a, b) => {
    if (a === "Неизвестно") return 1;
    if (b === "Неизвестно") return -1;
    return a.localeCompare(b);
  });
});

const yearItems = computed(() => {
  if (!tracks.value || tracks.value.length === 0) return [];
  const items = new Set();
  tracks.value.forEach((track) => {
    const year = track.release_date?.split("-")[0] || "Неизвестно";
    items.add(year);
  });
  return Array.from(items).sort((a, b) => {
    if (a === "Неизвестно") return 1;
    if (b === "Неизвестно") return -1;
    return b.localeCompare(a);
  });
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
  return Array.from(items).sort((a, b) => {
    if (a === "неизвестно") return 1;
    if (b === "неизвестно") return -1;
    return a.localeCompare(b);
  });
});

// Закрытие фильтров при клике вне области
const handleClickOutside = (event) => {
  if (!event.target.closest(".filter__wrapper")) {
    activeFilter.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Остальные методы
const handlePlayTrack = (track) => {
  console.log("Play track", track);
};

const handleToggleFavorite = (track) => {
  console.log("Toggle favorite", track);
};

const handleSearch = (query) => {
  searchQuery.value = query;
};

const logout = () => {
  console.log("Logout");
  navigateTo("/login");
};
</script>

<style scoped>
/* Стили для фильтров */
.filter__wrapper {
  position: relative;
  display: inline-block;
}

.filter__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #313131;
  border-radius: 12px;
  padding: 34px;
  min-width: 248px;
  max-height: 305px;
  overflow-y: auto;
  z-index: 100;
  margin-top: 10px;
}

.filter__list {
  display: flex;
  flex-direction: column;
  gap: 28px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.filter__item {
  color: #fff;
  font-size: 20px;
  line-height: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
  font-family: "Montserrat", sans-serif;
  position: relative;
}

.filter__item:hover {
  color: #b672ff;
  text-decoration: underline;
}

.filter__item.active {
  color: #b672ff;
}

.filter__check {
  margin-left: 8px;
  color: #b672ff;
}

.filter__button--selected {
  border-color: #b672ff !important;
  color: #b672ff !important;
}

.filter__selected-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #b672ff;
  border-radius: 50%;
  margin-left: 5px;
}

.filter__reset {
  margin-left: 10px;
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.filter__reset:hover {
  color: #ff5252;
  border-color: #ff5252;
}

/* Активные фильтры */
.active-filters {
  margin: 15px 0 30px 294px;
  padding: 10px;
  background: rgba(182, 114, 255, 0.1);
  border-radius: 8px;
  max-width: calc(100% - 294px);
}

.active-filters__title {
  font-size: 14px;
  color: #b672ff;
  margin-bottom: 8px;
  font-weight: 500;
}

.active-filters__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.active-filter {
  display: inline-flex;
  align-items: center;
  background: #313131;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: #fff;
}

.active-filter__remove {
  margin-left: 6px;
  cursor: pointer;
  color: #ff6b6b;
  font-weight: bold;
  font-size: 14px;
}

.active-filter__remove:hover {
  color: #ff5252;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #fff;
  font-family: "Montserrat", sans-serif;
}

.error {
  color: #ff6b6b;
}

/* Адаптивность для фильтров */
@media (max-width: 991px) {
  .active-filters {
    margin: 15px 0 30px 0;
    max-width: 100%;
  }
}

@media (max-width: 767px) {
  .filter__dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 300px;
    padding: 20px;
  }

  .filter__list {
    gap: 20px;
  }

  .filter__item {
    font-size: 16px;
  }

  .active-filters__list {
    flex-direction: column;
    align-items: flex-start;
  }

  .active-filter {
    font-size: 11px;
  }
}

@media (max-width: 575px) {
  .centerblock__filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter__wrapper {
    margin-bottom: 10px;
  }
}
</style>
