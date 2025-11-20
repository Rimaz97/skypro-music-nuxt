<template>
  <div class="centerblock__search search">
    <svg class="search__svg">
      <use xlink:href="/img/icon/sprite.svg#icon-search" />
    </svg>
    <input
      :value="modelValue"
      class="search__text"
      type="search"
      placeholder="Поиск"
      name="search"
      @input="handleInput"
    >
    <div v-if="modelValue" class="search-clear" @click="clearSearch">×</div>
  </div>
</template>

<script setup>
// Убираем неиспользуемую переменную props, так как modelValue используется в шаблоне
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'search']);

const handleInput = (event) => {
  const value = event.target.value;
  emit('update:modelValue', value);
  emit('search', value);
};

const clearSearch = () => {
  emit('update:modelValue', '');
  emit('search', '');
};
</script>

<style scoped>
.search {
  position: relative;
  border-bottom: 1px solid #4e4e4e;
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 1293px;
}

.search__svg {
  width: 12px;
  height: 12px;
  margin-right: 5px;
  stroke: #ffffff;
  fill: transparent;
  flex-shrink: 0;
}

.search__text {
  background-color: transparent; /* Прозрачный фон */
  border: none;
  padding: 13px 10px 14px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  width: 200px;
}

.search__text::placeholder {
  background-color: transparent;
  color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
  color: #696969;
}

.search-clear:hover {
  color: #ffffff;
}

@media (max-width: 991px) {
  .search {
    margin-left: 0;
    width: 100%;
    max-width: 300px;
  }
  
  .search__text {
    width: 100%;
  }
}
</style>