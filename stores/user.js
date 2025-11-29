import { defineStore } from "pinia";

const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
  }),

  actions: {
    validateCredentials(email, password, username = "") {
      const errors = [];

      if (!email?.trim()) errors.push("Email обязателен");
      else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Некорректный email");

      if (!password) errors.push("Пароль обязателен");
      else if (password.length < 6)
        errors.push("Пароль должен быть не менее 6 символов");

      if (username && !username.trim())
        errors.push("Имя пользователя не может состоять только из пробелов");

      return errors;
    },

    async getTokens(email, password) {
      try {
        const response = await fetch(`${API_URL}/user/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          let errorMessage = "Ошибка получения токенов";
          if (data.detail) errorMessage = data.detail;
          else if (data.email) errorMessage = `Email: ${data.email[0]}`;
          else if (data.password) errorMessage = `Пароль: ${data.password[0]}`;

          throw new Error(errorMessage);
        }

        if (!data.access || !data.refresh) {
          throw new Error("Сервер не вернул токены доступа");
        }

        return {
          access: data.access,
          refresh: data.refresh,
        };
      } catch (error) {
        console.error("Token retrieval error:", error);
        throw error;
      }
    },

    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;

        const validationErrors = this.validateCredentials(
          credentials.email,
          credentials.password
        );
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(", "));
        }

        const loginResponse = await fetch(`${API_URL}/user/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          let errorMessage = "Ошибка авторизации";
          if (loginData.message) errorMessage = loginData.message;
          else if (loginData.detail) errorMessage = loginData.detail;
          else if (loginResponse.status === 401)
            errorMessage = "Неверный email или пароль";

          throw new Error(errorMessage);
        }

        const tokens = await this.getTokens(
          credentials.email,
          credentials.password
        );

        this.setUser({
          email: credentials.email.trim(),
          username:
            loginData.username || credentials.email.trim().split("@")[0],
          access: tokens.access,
          refresh: tokens.refresh,
        });

        return true;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      try {
        this.loading = true;
        this.error = null;

        const validationErrors = this.validateCredentials(
          userData.email,
          userData.password,
          userData.username
        );
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(", "));
        }

        const response = await fetch(`${API_URL}/user/signup/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email.trim(),
            password: userData.password,
            username: userData.username.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          let errorMessage = "Ошибка регистрации";

          if (response.status === 403) {
            errorMessage =
              "Доступ запрещен. Возможно, пользователь с таким email уже существует";
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.email) {
            errorMessage = `Email: ${data.email[0]}`;
          } else if (data.username) {
            errorMessage = `Имя пользователя: ${data.username[0]}`;
          } else if (data.password) {
            errorMessage = `Пароль: ${data.password[0]}`;
          } else if (data.detail) {
            errorMessage = data.detail;
          }

          throw new Error(errorMessage);
        }

        const tokens = await this.getTokens(userData.email, userData.password);

        this.setUser({
          email: userData.email.trim(),
          username: data.result?.username || userData.username.trim(),
          access: tokens.access,
          refresh: tokens.refresh,
        });

        return true;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async refreshToken() {
      try {
        if (!this.refreshToken) {
          throw new Error("Refresh token отсутствует");
        }

        const response = await fetch(`${API_URL}/user/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: this.refreshToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          if (response.status === 401) {
            this.clearUser();
            throw new Error("Требуется повторный вход");
          }

          throw new Error(
            errorData.detail || `Ошибка обновления токена: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.access) {
          throw new Error("Сервер не вернул новый access token");
        }

        this.token = data.access;

        if (process.client) {
          localStorage.setItem("token", this.token);
        }

        return data.access;
      } catch (error) {
        console.error("Token refresh error:", error);
        if (
          error.message.includes("Требуется повторный вход") ||
          error.message.includes("401")
        ) {
          this.clearUser();
        }
        throw error;
      }
    },

    setUser(userData) {
      this.user = {
        email: userData.email,
        username: userData.username,
        name: userData.username,
      };
      this.isAuthenticated = true;
      this.token = userData.access;
      this.refreshToken = userData.refresh;

      if (process.client) {
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
        localStorage.setItem("refreshToken", this.refreshToken);
        localStorage.setItem("isAuthenticated", "true");
      }
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      this.refreshToken = null;
      this.error = null;

      if (process.client) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAuthenticated");
      }
    },

    restoreUser() {
      if (process.client) {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        if (userData && token && refreshToken && isAuthenticated === "true") {
          this.user = JSON.parse(userData);
          this.token = token;
          this.refreshToken = refreshToken;
          this.isAuthenticated = true;
        }
      }
    },
  },

  getters: {
    userName: (state) =>
      state.user?.name ||
      state.user?.username ||
      state.user?.email ||
      "Пользователь",
  },
});
