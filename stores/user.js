import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    registeredUsers: [], // Массив зарегистрированных пользователей
  }),

  actions: {
    async login(credentials) {
      try {
        // Имитируем задержку сети
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Проверяем, что email и пароль не пустые
        if (!credentials.email?.trim() || !credentials.password) {
          throw new Error("Email и пароль обязательны для заполнения");
        }

        // Ищем пользователя в списке зарегистрированных
        const foundUser = this.registeredUsers.find(
          (user) =>
            user.email === credentials.email.trim() &&
            user.password === credentials.password
        );

        if (foundUser) {
          const mockUser = {
            id: foundUser.id,
            email: foundUser.email,
            username: foundUser.username,
            name: foundUser.name,
            access: "mock-jwt-token-" + Date.now(),
          };

          this.setUser(mockUser);
          return true;
        } else {
          throw new Error("Пользователь не найден. Зарегистрируйтесь сначала.");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },

    async register(userData) {
      try {
        // Имитируем задержку сети
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Проверяем, что все поля заполнены
        if (
          !userData.email?.trim() ||
          !userData.password ||
          !userData.username?.trim()
        ) {
          throw new Error("Все поля обязательны для заполнения");
        }

        // Проверяем, не зарегистрирован ли уже пользователь с таким email
        const existingUser = this.registeredUsers.find(
          (user) => user.email === userData.email.trim()
        );

        if (existingUser) {
          throw new Error("Пользователь с таким email уже зарегистрирован");
        }

        // Создаем нового пользователя
        const newUser = {
          id: Date.now(),
          email: userData.email.trim(),
          username: userData.username.trim(),
          name: userData.username.trim(),
          password: userData.password, // Сохраняем пароль для проверки при входе
        };

        // Добавляем в список зарегистрированных пользователей
        this.registeredUsers.push(newUser);
        this.saveRegisteredUsers();

        // Устанавливаем текущего пользователя
        const mockUser = {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          name: newUser.name,
          access: "mock-jwt-token-" + Date.now(),
        };

        this.setUser(mockUser);
        return true;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },

    setUser(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.token = userData.access;

      // Сохраняем в localStorage
      if (import.meta.client) {
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
        localStorage.setItem("isAuthenticated", "true");
      }
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;

      // Очищаем localStorage
      if (import.meta.client) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
      }
    },

    // Сохраняем список зарегистрированных пользователей
    saveRegisteredUsers() {
      if (import.meta.client) {
        localStorage.setItem(
          "registeredUsers",
          JSON.stringify(this.registeredUsers)
        );
      }
    },

    // Восстанавливаем список зарегистрированных пользователей
    restoreRegisteredUsers() {
      if (import.meta.client) {
        const storedUsers = localStorage.getItem("registeredUsers");
        if (storedUsers) {
          this.registeredUsers = JSON.parse(storedUsers);
        }
      }
    },

    restoreUser() {
      if (import.meta.client) {
        // Восстанавливаем зарегистрированных пользователей
        this.restoreRegisteredUsers();

        // Восстанавливаем текущего пользователя
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        if (userData && token && isAuthenticated === "true") {
          this.user = JSON.parse(userData);
          this.token = token;
          this.isAuthenticated = true;
        }
      }
    },

    // Метод для очистки всех данных (для тестирования)
    clearAllData() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      this.registeredUsers = [];

      if (import.meta.client) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("registeredUsers");
      }
    },
  },

  getters: {
    userName: (state) =>
      state.user?.name ||
      state.user?.username ||
      state.user?.email ||
      "Пользователь",
    isUsingMockData: () => true,
    registeredUsersCount: (state) => state.registeredUsers.length,
  },
});
