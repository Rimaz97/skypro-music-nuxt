<template>
  <div class="modal__block">
    <form class="modal__form-login" @submit.prevent="handleSubmit">
      <NuxtLink to="/">
        <div class="modal__logo">
          <img src="/img/logo_modal.png" alt="logo" >
        </div>
      </NuxtLink>

      <input
        v-model="email"
        class="modal__input login"
        type="text"
        name="login"
        placeholder="Почта"
        @input="clearError"
      >

      <input
        v-model="password"
        class="modal__input password-first"
        type="password"
        name="password"
        placeholder="Пароль"
        @input="clearError"
      >

      <input
        v-model="confirmPassword"
        class="modal__input password-double"
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        @input="clearError"
      >

      <button type="submit" class="modal__btn" :disabled="loading">
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>

      <NuxtLink to="/login" class="modal__btn-switch">
        Войти
      </NuxtLink>

      <!-- Сообщение об ошибке -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
// Указываем использование auth layout
definePageMeta({
  layout: 'auth'
});

// Динамический заголовок для страницы регистрации
useHead({
  title: "Регистрация | Skypro.Music",
});

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMessage = ref("");

const clearError = () => {
  errorMessage.value = "";
};

const handleSubmit = async () => {
  // Сбрасываем предыдущие ошибки
  errorMessage.value = "";
  loading.value = true;

  try {
    // Валидация полей
    if (!email.value.trim()) {
      throw showError({
        statusCode: 400,
        message: "Введите email",
      });
    }

    if (!password.value.trim()) {
      throw showError({
        statusCode: 400,
        message: "Введите пароль",
      });
    }

    if (!confirmPassword.value.trim()) {
      throw showError({
        statusCode: 400,
        message: "Повторите пароль",
      });
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      throw showError({
        statusCode: 400,
        message: "Введите корректный email",
      });
    }

    // Проверка длины пароля
    if (password.value.length < 6) {
      throw showError({
        statusCode: 400,
        message: "Пароль должен содержать минимум 6 символов",
      });
    }

    // Проверка совпадения паролей
    if (password.value !== confirmPassword.value) {
      throw showError({
        statusCode: 400,
        message: "Пароли не совпадают",
      });
    }

    // Здесь будет реальная логика регистрации
    console.log("Попытка регистрации:", email.value);
    
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Если успешно, перенаправляем на главную
    navigateTo("/");
    
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    
    // Если это наша кастомная ошибка, показываем ее
    if (error.statusCode === 400) {
      errorMessage.value = error.message;
    } else {
      // Для других ошибок используем showError
      throw showError({
        statusCode: 500,
        message: "Произошла ошибка при регистрации. Попробуйте еще раз.",
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal__block {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  max-width: 366px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal__form-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.modal__logo {
  margin-bottom: 20px;
}

.modal__logo img {
  width: 140px;
}

.modal__input {
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.2;
  color: #000000;
  transition: border-color 0.3s;
}

.modal__input:focus {
  outline: none;
  border-color: #b672ff;
}

.modal__input::placeholder {
  color: #b1b1b1;
}

.modal__btn {
  width: 100%;
  padding: 12px;
  background: #b672ff;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal__btn:hover:not(:disabled) {
  background: #9a5ae0;
}

.modal__btn:disabled {
  background: #7c7c7c;
  cursor: not-allowed;
}

.modal__btn-switch {
  color: #b672ff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.modal__btn-switch:hover {
  color: #9a5ae0;
  text-decoration: underline;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  width: 100%;
}
</style>