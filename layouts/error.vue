<template>
  <div class="error-layout">
    <div class="error-container">
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Страница не найдена</h2>
        <p class="error-description">
          Возможно, страница была удалена или вы перешли по неверной ссылке.
        </p>
        <NuxtLink to="/" class="error-button">
          <svg
            class="error-button-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M12.6667 8H3.33333"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M8 12.6667L3.33333 8L8 3.33333"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Вернуться на главную
        </NuxtLink>
      </div>
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
.error-layout {
  min-height: 100vh;
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: "Montserrat", sans-serif;
}

.error-container {
  max-width: 500px;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #b672ff;
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  margin: 20px 0 16px 0;
}

.error-description {
  font-size: 18px;
  color: #696969;
  line-height: 1.5;
  margin-bottom: 40px;
}

.error-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: #b672ff;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.error-button:hover {
  background: #9a5ae0;
  transform: translateY(-2px);
}

.error-button-icon {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-description {
    font-size: 16px;
  }
}
</style>
