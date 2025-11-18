<template>
  <nav class="main__nav nav">
    <div class="nav__logo logo">
      <NuxtLink to="/">
        <img class="logo__image" src="/img/logo.png" alt="Logo" />
      </NuxtLink>
    </div>
    <div
      class="nav__burger burger"
      :class="{ 'burger--active': isMenuOpen }"
      @click="toggleMenu"
    >
      <span class="burger__line"></span>
      <span class="burger__line"></span>
      <span class="burger__line"></span>
    </div>
    <div
      class="nav__menu menu"
      :class="{ 'menu--active': isMenuOpen }"
      @click="closeMenu"
    >
      <ul class="menu__list" @click.stop>
        <li class="menu__item">
          <NuxtLink to="/" class="menu__link" @click="closeMenu">
            Главное
          </NuxtLink>
        </li>
        <li class="menu__item">
          <NuxtLink to="/favorites" class="menu__link" @click="closeMenu">
            Мой плейлист
          </NuxtLink>
        </li>
        <li class="menu__item">
          <a href="#" class="menu__link" @click.prevent="logout">Выйти</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = () => {
  console.log("Logout");
  navigateTo("/login");
  closeMenu();
};

// Закрытие меню при клике вне его области
const handleClickOutside = (event) => {
  if (!event.target.closest(".nav")) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  position: relative;
}

.nav__logo {
  margin-right: auto;
}

.logo__image {
  width: 113.33px;
  height: 17px;
}

/* Бургер всегда виден */
.nav__burger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
  padding: 0;
  background: none;
  border: none;
  margin-left: auto;
  z-index: 1002;
  position: relative;
}

.burger__line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.burger--active .burger__line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.burger--active .burger__line:nth-child(2) {
  opacity: 0;
}

.burger--active .burger__line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Меню скрыто по умолчанию */
.nav__menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #181818;
  border: 1px solid #4e4e4e;
  border-radius: 8px;
  padding: 10px 0;
  min-width: 200px;
  z-index: 1001;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

/* Когда меню активно */
.nav__menu.menu--active {
  display: block;
}

.menu__list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0;
}

.menu__item {
  margin-bottom: 0;
  list-style: none;
}

.menu__link {
  display: block;
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  transition: all 0.3s ease;
  text-decoration: none;
  padding: 12px 20px;
  border-bottom: 1px solid #2e2e2e;
}

.menu__link:hover {
  color: #b672ff;
  background-color: rgba(255, 255, 255, 0.05);
}

.menu__item:last-child .menu__link {
  border-bottom: none;
}

/* Стили для активной ссылки */
.menu__link.router-link-active,
.menu__link.nuxt-link-active {
  color: #b672ff;
}

/* Адаптивность для мобильных */
@media (max-width: 767px) {
  .nav__menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    width: auto;
    margin: 0 15px;
    border-radius: 8px;
  }

  .logo__image {
    width: 100px;
  }
}

@media (max-width: 575px) {
  .nav__menu {
    top: 60px;
    margin: 0 10px;
  }

  .logo__image {
    width: 90px;
  }

  .menu__link {
    font-size: 14px;
    padding: 10px 15px;
  }
}
</style>
