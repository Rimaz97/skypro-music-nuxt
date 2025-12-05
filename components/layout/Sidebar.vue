<template>
  <div class="main__sidebar sidebar">
    <div class="sidebar__block">
      <div class="sidebar__list">
        <div class="sidebar__item">
          <NuxtLink class="sidebar__link" to="/playlist/day">
            <NuxtImg
              class="sidebar__img"
              src="/img/playlist01.png"
              alt="Плейлист дня"
              :placeholder="[5]"
              loading="lazy"
            />
          </NuxtLink>
        </div>
        <div class="sidebar__item">
          <NuxtLink class="sidebar__link" to="/playlist/dance">
            <NuxtImg
              class="sidebar__img"
              src="/img/playlist02.png"
              alt="100 танцевальных хитов"
              :placeholder="[5]"
              loading="lazy"
            />
          </NuxtLink>
        </div>
        <div class="sidebar__item">
          <NuxtLink class="sidebar__link" to="/playlist/indie">
            <NuxtImg
              class="sidebar__img"
              src="/img/playlist03.png"
              alt="Инди-заряд"
              :placeholder="[5]"
              loading="lazy"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main__sidebar {
  padding: 20px 90px 20px 78px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.sidebar__block {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sidebar__item {
  width: 250px;
  height: 150px;
  margin-bottom: 30px;
  position: relative;
}

.sidebar__link {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}

.sidebar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.sidebar__img:hover {
  transform: scale(1.05);
}
</style>
