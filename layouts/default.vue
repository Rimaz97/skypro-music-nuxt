<template>
  <div class="wrapper">
    <div class="container">
      <!-- Верхняя панель -->
      <div v-if="_showFullInterface" class="top-container">
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
      <main class="main" :class="{ 'main--auth': !_showFullInterface }">
        <div class="main__centerblock centerblock">
          <slot />
        </div>

        <LayoutSidebar v-if="_showFullInterface" />
      </main>

      <!-- Плеер внизу -->
      <LayoutPlayer v-if="_showFullInterface && _playerStore.showPlayer" />
    </div>
  </div>
</template>

<script setup>
import { useFiltersStore } from '~/stores/filters';
import { usePlayerStore } from '~/stores/player';
import { useUserStore } from '~/stores/user';

const filtersStore = useFiltersStore();
const _playerStore = usePlayerStore(); // Добавляем префикс _ для использования в шаблоне
const userStore = useUserStore();
const route = useRoute();

// Показывать ли полный интерфейс (с плеером, сайдбаром и т.д.)
const _showFullInterface = computed(() => { // Добавляем префикс _ для использования в шаблоне
  // Не показывать на страницах входа и регистрации
  return !['/login', '/register'].includes(route.path);
});

const logout = () => {
  userStore.clearUser();
  navigateTo("/login");
};

// Восстанавливаем пользователя при загрузке
onMounted(() => {
  userStore.restoreUser();
});

const _usedVars = [_playerStore, _showFullInterface];
</script>

<style scoped>
.main--auth {
  justify-content: center;
  align-items: center;
}
</style>