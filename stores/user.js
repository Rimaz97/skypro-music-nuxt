import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
  }),

  actions: {
    setUser(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.token = userData.token || `user-token-${Date.now()}`;
      
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

    restoreUser() {
      if (import.meta.client) {
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
  },

  getters: {
    userName: (state) => state.user?.name || state.user?.email || "Пользователь",
    userEmail: (state) => state.user?.email || "",
  },
});