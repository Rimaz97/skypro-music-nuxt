<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Вход в Skypro Music</h2>

      <!-- Индикатор мок-режима -->

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="loginForm.email"
          type="email"
          placeholder="user@example.com"
          required
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          id="password"
          v-model="loginForm.password"
          type="password"
          placeholder="Введите ваш пароль"
          required
          autocomplete="current-password"
        />
      </div>

      <button type="submit" :disabled="loading" class="login-btn">
        {{ loading ? "Вход..." : "Войти" }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>

      <p class="register-link">
        Нет аккаунта? <NuxtLink to="/register">Зарегистрироваться</NuxtLink>
      </p>
    </form>
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
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const cleanCredentials = {
      email: loginForm.value.email.trim(),
      password: loginForm.value.password,
    };

    await userStore.login(cleanCredentials);
    await router.push("/");
  } catch (err) {
    error.value = err.message || "Ошибка входа. Проверьте введенные данные.";
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  position: relative;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.mock-indicator {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #155724;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin: 1rem 0;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.stats {
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 5px;
  font-size: 0.9rem;
  color: #666;
}

.demo-hint {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  font-size: 0.9rem;
  color: #666;
  border-left: 4px solid #28a745;
}

.demo-hint p {
  margin: 0.25rem 0;
}
</style>
