<template>
  <div>
    <h2 class="centerblock__h2">Треки</h2>

    <!-- Блок сортировки и фильтров -->
    <div class="centerblock__top">
      <!-- Сортировка -->
      <div class="centerblock__filter filter">
        <div class="filter__title">Сортировка:</div>
        <div class="sort__buttons">
          <button
            class="filter__button _btn-text"
            :class="{
              active: sortStore.currentSort === 'default',
              'filter__button--selected': sortStore.currentSort === 'default',
            }"
            @click="sortStore.setSort('default')"
          >
            по умолчанию
          </button>
          <button
            class="filter__button _btn-text"
            :class="{
              active: sortStore.currentSort === 'newest',
              'filter__button--selected': sortStore.currentSort === 'newest',
            }"
            @click="sortStore.setSort('newest')"
          >
            сначала новые
          </button>
          <button
            class="filter__button _btn-text"
            :class="{
              active: sortStore.currentSort === 'oldest',
              'filter__button--selected': sortStore.currentSort === 'oldest',
            }"
            @click="sortStore.setSort('oldest')"
          >
            сначала старые
          </button>
        </div>
      </div>

      <!-- Фильтры -->
      <div class="centerblock__filter filter">
        <div class="filter__title">Искать по:</div>

        <!-- Фильтр по исполнителю -->
        <div class="filter__wrapper">
          <div
            class="filter__button button-author _btn-text"
            :class="{
              active: filtersStore.activeFilter === 'author',
              'filter__button--selected': filtersStore.filterCounts.author > 0,
            }"
            @click="filtersStore.setActiveFilter('author')"
          >
            исполнителю
            <span
              v-if="filtersStore.filterCounts.author > 0"
              class="filter__count"
            >
              {{ filtersStore.filterCounts.author }}
            </span>
          </div>
          <div
            v-show="filtersStore.activeFilter === 'author'"
            class="filter__dropdown"
          >
            <ul class="filter__list">
              <li
                v-for="item in authorItems"
                :key="item"
                class="filter__item"
                :class="{
                  active: filtersStore.selectedFilters.author.includes(item),
                }"
                @click="filtersStore.toggleSelectedFilter('author', item)"
              >
                {{ item }}
                <span
                  v-if="filtersStore.selectedFilters.author.includes(item)"
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
              active: filtersStore.activeFilter === 'year',
              'filter__button--selected': filtersStore.filterCounts.year > 0,
            }"
            @click="filtersStore.setActiveFilter('year')"
          >
            году выпуска
            <span
              v-if="filtersStore.filterCounts.year > 0"
              class="filter__count"
            >
              {{ filtersStore.filterCounts.year }}
            </span>
          </div>
          <div
            v-show="filtersStore.activeFilter === 'year'"
            class="filter__dropdown"
          >
            <ul class="filter__list">
              <li
                v-for="item in yearItems"
                :key="item"
                class="filter__item"
                :class="{
                  active: filtersStore.selectedFilters.year.includes(item),
                }"
                @click="filtersStore.toggleSelectedFilter('year', item)"
              >
                {{ item }}
                <span
                  v-if="filtersStore.selectedFilters.year.includes(item)"
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
              active: filtersStore.activeFilter === 'genre',
              'filter__button--selected': filtersStore.filterCounts.genre > 0,
            }"
            @click="filtersStore.setActiveFilter('genre')"
          >
            жанру
            <span
              v-if="filtersStore.filterCounts.genre > 0"
              class="filter__count"
            >
              {{ filtersStore.filterCounts.genre }}
            </span>
          </div>
          <div
            v-show="filtersStore.activeFilter === 'genre'"
            class="filter__dropdown"
          >
            <ul class="filter__list">
              <li
                v-for="item in genreItems"
                :key="item"
                class="filter__item"
                :class="{
                  active: filtersStore.selectedFilters.genre.includes(item),
                }"
                @click="filtersStore.toggleSelectedFilter('genre', item)"
              >
                {{ item }}
                <span
                  v-if="filtersStore.selectedFilters.genre.includes(item)"
                  class="filter__check"
                  >✓</span
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Кнопка сброса фильтров -->
        <div
          v-if="filtersStore.hasActiveFilters"
          class="filter__reset _btn-text"
          @click="filtersStore.resetFilters"
        >
          сбросить фильтры
        </div>
      </div>
    </div>

    <!-- Активные фильтры -->
    <div v-if="filtersStore.hasActiveFilters" class="active-filters">
      <div class="active-filters__title">Активные фильтры:</div>
      <div class="active-filters__list">
        <span
          v-for="author in filtersStore.selectedFilters.author"
          :key="author"
          class="active-filter"
        >
          Исполнитель: {{ author }}
          <span
            class="active-filter__remove"
            @click="filtersStore.toggleSelectedFilter('author', author)"
            >×</span
          >
        </span>
        <!-- Теперь годы тоже в цикле -->
        <span
          v-for="year in filtersStore.selectedFilters.year"
          :key="year"
          class="active-filter"
        >
          Год: {{ year }}
          <span
            class="active-filter__remove"
            @click="filtersStore.toggleSelectedFilter('year', year)"
            >×</span
          >
        </span>
        <span
          v-for="genre in filtersStore.selectedFilters.genre"
          :key="genre"
          class="active-filter"
        >
          Жанр: {{ genre }}
          <span
            class="active-filter__remove"
            @click="filtersStore.toggleSelectedFilter('genre', genre)"
            >×</span
          >
        </span>
      </div>
    </div>

    <!-- Состояния загрузки и ошибки -->
    <div v-if="pending" class="content__playlist playlist">
      <div class="loading">Загрузка треков...</div>
    </div>

    <div v-else-if="error" class="content__playlist playlist">
      <div class="error">Ошибка загрузки треков: {{ error.message }}</div>
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
          :key="track._id"
          :track="track"
          :playlist="filteredTracks"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Динамический заголовок для главной страницы
useHead({
  title: "Главная | Skypro.Music",
});

// Основная загрузка треков - критичные данные, используем обычный useFetch
const {
  data: response,
  pending,
  error,
} = await useFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/"
);

const tracks = computed(() => response.value?.data || []);

// Используем store для фильтров и сортировки
const filtersStore = useFiltersStore();
const sortStore = useSortStore();

// Используем composable для фильтрации и сортировки треков
const { filteredTracks, authorItems, yearItems, genreItems } =
  useTrackFilters(tracks);

// Закрытие фильтров при клике вне области
const handleClickOutside = (event) => {
  if (!event.target.closest(".filter__wrapper")) {
    filtersStore.activeFilter = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleToggleFavorite = (track) => {
  console.log("Toggle favorite", track);
};
</script>

<style scoped>
/* Стили для сортировки */
.centerblock__top {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.sort__buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

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
  max-height: 350px;
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
  max-height: 250px;
  overflow-y: auto;
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

.filter__button {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #ffffff;
}

.filter__button:hover {
  border-color: #d9b6ff;
  color: #d9b6ff;
}

.filter__button.active {
  border-color: #b672ff;
  color: #b672ff;
}

.filter__button--selected {
  border-color: #b672ff !important;
  color: #b672ff !important;
  background: rgba(182, 114, 255, 0.1);
}

.filter__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background: #b672ff;
  color: white;
  border-radius: 50%;
  font-size: 12px;
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
  margin: 15px 0 30px 0;
  padding: 10px;
  background: rgba(182, 114, 255, 0.1);
  border-radius: 8px;
  max-width: 100%;
  margin-left: 294px;
}

.active-filters__title {
  font-size: 14px;
  color: #ffffff;
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

/* Адаптивность */
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

  .sort__buttons {
    flex-direction: column;
    width: 100%;
  }

  .filter__button {
    width: 100%;
    text-align: center;
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
