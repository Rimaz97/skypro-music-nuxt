import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../user";

describe("userStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("инициализируется с пустыми значениями", () => {
    const userStore = useUserStore();
    expect(userStore.user).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
    expect(userStore.token).toBeNull();
  });

  it("устанавливает пользователя", () => {
    const userStore = useUserStore();
    const userData = {
      email: "test@example.com",
      name: "Test User",
      access: "test-token",
    };

    userStore.setUser(userData);

    expect(userStore.user).toEqual(userData);
    expect(userStore.isAuthenticated).toBe(true);
    expect(userStore.token).toBe("test-token");
  });

  it("очищает пользователя", () => {
    const userStore = useUserStore();

    // Сначала устанавливаем пользователя
    userStore.setUser({
      email: "test@example.com",
      name: "Test User",
      token: "test-token",
    });

    // Затем очищаем
    userStore.clearUser();

    expect(userStore.user).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
    expect(userStore.token).toBeNull();
  });
});
