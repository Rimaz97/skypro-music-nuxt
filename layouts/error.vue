<template>
  <div class="error-page">
    <div class="error-content">
      <h1>Ошибка {{ error.statusCode }}</h1>
      <p>{{ error.message }}</p>
      <NuxtLink to="/" class="error-link">Вернуться на главную</NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #181818;
  color: white;
  padding: 20px;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-page h1 {
  font-size: 48px;
  margin-bottom: 20px;
  color: #b672ff;
}

.error-page p {
  font-size: 18px;
  margin-bottom: 30px;
  line-height: 1.5;
}

.error-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #b672ff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.error-link:hover {
  background-color: #9a5ae0;
}
</style>
