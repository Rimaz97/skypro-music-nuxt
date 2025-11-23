<template>
  <div>
    <h2 class="centerblock__h2">{{ categoryName || 'Категория' }}</h2>
    
    <div class="centerblock__content playlist-content">
      <div class="content__title playlist-title">
        <div class="playlist-title__col col01">Трек</div>
        <div class="playlist-title__col col02">Исполнитель</div>
        <div class="playlist-title__col col03">Альбом</div>
        <div class="playlist-title__col col04">
          <svg class="playlist-title__svg">
            <use xlink:href="/img/icon/sprite.svg#icon-watch" />
          </svg>
        </div>
      </div>
      
      <div class="content__playlist playlist">
        <div class="loading">Страница категории в разработке</div>
        <!-- Позже добавим треки категории -->
      </div>
    </div>
  </div>
</template>

<script setup>
const categoryName = ref('')

// Динамический заголовок страницы
useHead({
  title: `${categoryName.value || 'Категория'} | Skypro.Music`,
})

// Обновляем заголовок при изменении названия категории
watch(categoryName, (newName) => {
  useHead({
    title: `${newName || 'Категория'} | Skypro.Music`,
  })
})

// Когда будем добавлять логику, используем:
// const route = useRoute()
// const categoryId = route.params.id
</script>