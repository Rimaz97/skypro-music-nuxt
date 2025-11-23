<template>
  <div class="wrapper">
    <div class="container">
      <!-- Верхняя панель -->
      <div class="top-container">
        <div class="top-left">
          <LayoutNavbar />
        </div>

        <div class="top-center">
          <!-- Поиск показываем только на главной странице -->
          <TracksSearch
            v-if="$route.path === '/'"
            :model-value="filtersStore.searchQuery"
            @update:model-value="filtersStore.setSearchQuery"
            @search="filtersStore.setSearchQuery"
          />
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

      <!-- Основной контент -->
      <main class="main">
        <div class="main__centerblock centerblock">
          <slot />
        </div>

        <LayoutSidebar />
      </main>

      <!-- Плеер внизу -->
      <LayoutPlayer />
    </div>
  </div>
</template>

<script setup>
import { useFiltersStore } from '~/stores/filters';

const filtersStore = useFiltersStore();

// Базовые метатеги для всего сайта
useHead({
  title: "Skypro.Music",
  meta: [
    { name: "description", content: "Лучший музыкальный сервис" },
  ],
});

const logout = () => {
  navigateTo("/login");
};
</script>