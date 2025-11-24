<template>
  <div class="auth-layout">
    <div class="wrapper">
      <div class="container-auth">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
// Базовые метатеги для страниц аутентификации
useHead({
  title: "Skypro.Music - Аутентификация",
});
</script>

<style scoped>
.auth-layout {
  width: 100%;
  min-height: 100vh;
  background-color: #181818;
}

.wrapper {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-color: #383838;
}

.container-auth {
  max-width: 100%;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>