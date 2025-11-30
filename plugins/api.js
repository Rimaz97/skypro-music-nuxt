// plugins/api.js
export default defineNuxtPlugin(() => {
  const userStore = useUserStore();

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async function (...args) {
    const [resource, config = {}] = args;

    // Пропускаем запросы на аутентификацию и обновление токена
    if (
      typeof resource === "string" &&
      (resource.includes("/user/login/") ||
        resource.includes("/user/signup/") ||
        resource.includes("/user/token/") ||
        resource.includes("/user/token/refresh/"))
    ) {
      return originalFetch(resource, config);
    }

    // Добавляем токен к запросам к API для авторизованных пользователей
    if (
      typeof resource === "string" &&
      resource.includes("webdev-music") &&
      userStore.token
    ) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${userStore.token}`,
        "Content-Type": "application/json",
      };
    }

    try {
      const response = await originalFetch(resource, config);

      // Обрабатываем 401 ошибки
      if (response.status === 401 && userStore.token) {
        console.log("Обнаружена 401 ошибка, пробуем обновить токен...");
        try {
          await userStore.refreshToken();

          // Повторяем запрос с новым токеном
          if (userStore.token) {
            config.headers.Authorization = `Bearer ${userStore.token}`;
            return await originalFetch(resource, config);
          }
        } catch (refreshError) {
          console.error("Не удалось обновить токен:", refreshError);
          userStore.clearUser();
        }
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
});
