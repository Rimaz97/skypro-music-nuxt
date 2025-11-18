<template>
  <div class="wrapper">
    <div class="container">
      <div class="top-container">
        <LayoutNavbar />

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
          <div v-if="searchQuery" class="search-clear" @click="clearSearch">
            ×
          </div>
        </div>

        <div class="sidebar__personal">
          <p class="sidebar__personal-name">
            {{ userName }}
          </p>
          <div class="sidebar__icon" @click="logout">
            <svg>
              <use xlink:href="/img/icon/sprite.svg#logout"></use>
            </svg>
          </div>
        </div>
      </div>

      <main class="main">
        <div class="main__centerblock centerblock">
          <h2 class="centerblock__h2">Треки</h2>
          <div class="centerblock__filter filter">
            <div class="filter__title">Искать по:</div>
            <div
              class="filter__button button-author _btn-text"
              @click="filterByAuthor"
            >
              исполнителю
            </div>
            <div
              class="filter__button button-year _btn-text"
              @click="filterByYear"
            >
              году выпуска
            </div>
            <div
              class="filter__button button-genre _btn-text"
              @click="filterByGenre"
            >
              жанру
            </div>
          </div>
          <TracksTrackList
            :tracks="filteredTracks"
            @play="handlePlayTrack"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
        <LayoutSidebar />
      </main>
      <LayoutPlayer />
    </div>
  </div>
</template>

<script setup>
// Данные треков
const tracksData = [
  {
    id: 1,
    title: "Guilt",
    artist: "Nero",
    album: "Welcome Reality",
    duration: "4:44",
    audioUrl: "/audio/guilt.mp3",
    cover: "/img/playlist01.png",
  },
  {
    id: 2,
    title: "Elektro",
    artist: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    duration: "2:22",
    audioUrl: "/audio/elektro.mp3",
    cover: "/img/playlist01.png",
  },
  {
    id: 3,
    title: "I'm Fire",
    artist: "Ali Bakgor",
    album: "I'm Fire",
    duration: "2:22",
    audioUrl: "/audio/im-fire.mp3",
    cover: "/img/playlist01.png",
  },
  {
    id: 4,
    title: "Non Stop",
    remix: "(Remix)",
    artist: "Стоункат, Psychopath",
    album: "Non Stop",
    duration: "4:12",
    audioUrl: "/audio/non-stop.mp3",
    cover: "/img/playlist02.png",
  },
  {
    id: 5,
    title: "Run Run",
    remix: "(feat. AR/CO)",
    artist: "Jaded, Will Clarke, AR/CO",
    album: "Run Run",
    duration: "2:54",
    audioUrl: "/audio/run-run.mp3",
    cover: "/img/playlist02.png",
  },
  {
    id: 6,
    title: "Eyes on Fire",
    remix: "(Zeds Dead Remix)",
    artist: "Blue Foundation, Zeds Dead",
    album: "Eyes on Fire",
    duration: "5:20",
    audioUrl: "/audio/eyes-on-fire.mp3",
    cover: "/img/playlist02.png",
  },
  {
    id: 7,
    title: "Mucho Bien",
    remix: "(Hi Profile Remix)",
    artist: "HYBIT, Mr. Black, Offer Nissim, Hi Profile",
    album: "Mucho Bien",
    duration: "3:41",
    audioUrl: "/audio/mucho-bien.mp3",
    cover: "/img/playlist03.png",
  },
  {
    id: 8,
    title: "Knives n Cherries",
    artist: "minthaze",
    album: "Captivating",
    duration: "1:48",
    audioUrl: "/audio/knives-n-cherries.mp3",
    cover: "/img/playlist03.png",
  },
  {
    id: 9,
    title: "How Deep Is Your Love",
    artist: "Calvin Harris, Disciples",
    album: "How Deep Is Your Love",
    duration: "3:32",
    audioUrl: "/audio/how-deep-is-your-love.mp3",
    cover: "/img/playlist03.png",
  },
  {
    id: 10,
    title: "Morena",
    artist: "Tom Boxer",
    album: "Soundz Made in Romania",
    duration: "3:36",
    audioUrl: "/audio/morena.mp3",
    cover: "/img/playlist01.png",
  },
];

const tracks = ref([]);
const searchQuery = ref("");
const userName = ref("Гость");

const filteredTracks = computed(() => {
  if (!searchQuery.value) return tracks.value;

  const query = searchQuery.value.toLowerCase();
  return tracks.value.filter(
    (track) =>
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.album.toLowerCase().includes(query)
  );
});

onMounted(() => {
  tracks.value = tracksData;
});

const handlePlayTrack = (track) => {
  console.log("Play track", track);
};

const handleToggleFavorite = (track) => {
  console.log("Toggle favorite", track);
};

const handleSearch = () => {
  // Поиск уже работает через computed свойство
};

const clearSearch = () => {
  searchQuery.value = "";
};

const filterByAuthor = () => {
  console.log("Filter by author");
};

const filterByYear = () => {
  console.log("Filter by year");
};

const filterByGenre = () => {
  console.log("Filter by genre");
};

const logout = () => {
  console.log("Logout");
  navigateTo("/login");
};
</script>
