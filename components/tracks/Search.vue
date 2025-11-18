<template>
  <div class="centerblock__search search">
    <svg class="search__svg">
      <use xlink:href="/img/icon/sprite.svg#icon-search"></use>
    </svg>
    <input
      class="search__text"
      type="search"
      placeholder="Поиск"
      name="search"
      v-model="searchQuery"
      @input="handleSearch"
    />
    <div v-if="searchQuery" class="search-clear" @click="clearSearch">×</div>
  </div>
</template>

<script setup>
const searchQuery = ref("");

const emit = defineEmits(["search"]);

const handleSearch = () => {
  emit("search", searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = "";
  emit("search", "");
};
</script>
