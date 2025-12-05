<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <NuxtImg
            src="/img/logo_modal.png"
            alt="Skypro.Music"
            class="logo-image"
          />
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Логин</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            class="form-input"
            placeholder="Введите ваш email"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="form-input"
            placeholder="Введите пароль"
            autocomplete="current-password"
            required
          />
        </div>

        <!-- Блок отображения ошибок -->
        <div v-if="userStore.error" class="error-message">
          {{ userStore.error }}
        </div>

        <button
          type="submit"
          :disabled="userStore.loading || loading"
          class="login-button"
        >
          <span v-if="userStore.loading || loading">Вход...</span>
          <span v-else>Войти</span>
        </button>

        <!-- Кнопка регистрации -->
        <NuxtLink to="/register" class="register-button">
          Зарегистрироваться
        </NuxtLink>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

const userStore = useUserStore();
const router = useRouter();

const loginForm = ref({
  email: "",
  password: "",
});
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;

  try {
    const cleanCredentials = {
      email: loginForm.value.email.trim(),
      password: loginForm.value.password,
    };

    await userStore.login(cleanCredentials);
    await router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
  }

  loading.value = false;
};

onMounted(() => {
  userStore.restoreUser();
  if (userStore.isAuthenticated) {
    router.push("/");
  }
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
}

.login-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.login-header {
  text-align: center;
  margin-bottom: 42px;
}

.logo-image {
  width: 140px;
  height: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  font-family: "Montserrat", sans-serif;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #b672ff;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(182, 114, 255, 0.1);
}

.form-input::placeholder {
  color: #6b7280;
}

.login-button {
  width: 100%;
  padding: 14px;
  background:#582ca2;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-button:hover:not(:disabled) {
  background: #582ca2;
  transform: translateY(-1px);
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Стили для кнопки регистрации */
.register-button {
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #000000;
  border: 2px solid #582ca2;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
  text-align: center;
  text-decoration: none;
  display: block;
}

.register-button:hover {
  background: #582ca2;
  color: #ffffff;
  transform: translateY(-1px);
}

.error-message {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  text-align: center;
}

@media (max-width: 480px) {
  .login-container {
    padding: 24px;
    margin: 0 16px;
  }
}
</style>
