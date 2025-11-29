<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="logo">
          <NuxtImg
            src="/img/logo_modal.png"
            alt="Skypro.Music"
            class="logo-image"
          />
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="registerForm.email"
            type="email"
            class="form-input"
            placeholder="Введите ваш email"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="username" class="form-label">Имя пользователя</label>
          <input
            id="username"
            v-model="registerForm.username"
            type="text"
            class="form-input"
            placeholder="Придумайте имя пользователя"
            autocomplete="username"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="registerForm.password"
            type="password"
            class="form-input"
            placeholder="Придумайте пароль"
            autocomplete="new-password"
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
          class="register-button"
        >
          <span v-if="userStore.loading || loading">Регистрация...</span>
          <span v-else>Зарегистрироваться</span>
        </button>

        <div class="register-footer">
          <p class="footer-text">
            Уже есть аккаунт?
            <NuxtLink to="/login" class="footer-link">Войти</NuxtLink>
          </p>
        </div>
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

const registerForm = ref({
  email: "",
  username: "",
  password: "",
});
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;

  try {
    const cleanData = {
      email: registerForm.value.email.trim(),
      username: registerForm.value.username.trim(),
      password: registerForm.value.password,
    };

    await userStore.register(cleanData);
    await router.push("/");
  } catch (error) {
    // Ошибка уже установлена в userStore.error, поэтому здесь просто ловим исключение
    console.error("Registration failed:", error);
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
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
}

.register-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.register-header {
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

.register-button {
  width: 100%;
  padding: 14px;
  background: #582ca2;
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

.register-button:hover:not(:disabled) {
  background: #582ca2;
  transform: translateY(-1px);
}

.register-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.register-footer {
  margin-top: 24px;
  text-align: center;
}

.footer-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  font-family: "Montserrat", sans-serif;
}

.footer-link {
  color: #582ca2;
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
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

/* Адаптивность */
@media (max-width: 480px) {
  .register-container {
    padding: 24px;
    margin: 0 16px;
  }
}
</style>
