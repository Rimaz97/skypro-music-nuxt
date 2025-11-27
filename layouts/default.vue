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
            <!-- Для авторизованных пользователей -->
            <div v-if="userStore.isAuthenticated" class="user-info">
              <span class="user-greeting" @click="logout">Привет, {{ userStore.userName }}</span>
              <div class="sidebar__icon" @click="logout">
                <svg>
                  <use xlink:href="/img/icon/sprite.svg#logout" />
                </svg>
              </div>
            </div>
            
            <!-- Для неавторизованных пользователей -->
            <div v-else class="sidebar__icon" @click="navigateToLogin">
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
import { useUserStore } from '~/stores/user';

const filtersStore = useFiltersStore();
const _playerStore = usePlayerStore();
const userStore = useUserStore();
const route = useRoute();

// Показывать ли полный интерфейс (с плеером, сайдбаром и т.д.)
const _showFullInterface = computed(() => {
  // Не показывать на страницах входа и регистрации
  return !['/login', '/register'].includes(route.path);
});

const logout = () => {
  userStore.clearUser();
  navigateTo("/login");
};

const navigateToLogin = () => {
  navigateTo("/login");
};

// Восстанавливаем пользователя при загрузке
onMounted(() => {
  userStore.restoreUser();
});

</script>

<style scoped>
.main--auth {
  justify-content: center;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-greeting {
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 5px;
  border-radius: 4px;
}

.user-greeting:hover {
  color: #b672ff;
  background-color: rgba(255, 255, 255, 0.05);
}

.sidebar__personal {
  display: flex;
  align-items: center;
}

.sidebar__icon {
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar__icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar__icon svg {

  fill: white;
}
</style>