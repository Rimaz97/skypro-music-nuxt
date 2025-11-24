import { describe, it, expect } from "vitest";

// Тестируемые функции
export const filterBySearch = (tracks, query) => {
  if (!query) return tracks;
  const lowerQuery = query.toLowerCase();
  return tracks.filter(track =>
    track.name?.toLowerCase().includes(lowerQuery) ||
    track.author?.toLowerCase().includes(lowerQuery) ||
    track.album?.toLowerCase().includes(lowerQuery)
  );
};

export const sortTracks = (tracks, sortType) => {
  const sorted = [...tracks];
  
  switch (sortType) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    case "oldest":
      return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    default:
      return sorted;
  }
};

describe("filterUtils", () => {
  const mockTracks = [
    { id: 1, name: "Rock Song", author: "Rock Band", album: "Rock Album", release_date: "2020-01-01" },
    { id: 2, name: "Pop Song", author: "Pop Singer", album: "Pop Album", release_date: "2021-01-01" },
    { id: 3, name: "Jazz Song", author: "Jazz Band", album: "Jazz Album", release_date: "2019-01-01" },
  ];

  describe("filterBySearch", () => {
    it("фильтрует по названию трека", () => {
      const result = filterBySearch(mockTracks, "rock");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Rock Song");
    });

    it("фильтрует по имени автора", () => {
      const result = filterBySearch(mockTracks, "pop singer");
      expect(result).toHaveLength(1);
      expect(result[0].author).toBe("Pop Singer");
    });

    it("фильтрует по названию альбома", () => {
      const result = filterBySearch(mockTracks, "jazz album");
      expect(result).toHaveLength(1);
      expect(result[0].album).toBe("Jazz Album");
    });

    it("возвращает все треки при пустом запросе", () => {
      const result = filterBySearch(mockTracks, "");
      expect(result).toHaveLength(3);
    });
  });

  describe("sortTracks", () => {
    it("сортирует от новых к старым", () => {
      const result = sortTracks(mockTracks, "newest");
      expect(result[0].release_date).toBe("2021-01-01");
      expect(result[1].release_date).toBe("2020-01-01");
      expect(result[2].release_date).toBe("2019-01-01");
    });

    it("сортирует от старых к новым", () => {
      const result = sortTracks(mockTracks, "oldest");
      expect(result[0].release_date).toBe("2019-01-01");
      expect(result[1].release_date).toBe("2020-01-01");
      expect(result[2].release_date).toBe("2021-01-01");
    });

    it("возвращает исходный порядок при default сортировке", () => {
      const result = sortTracks(mockTracks, "default");
      expect(result).toEqual(mockTracks);
    });
  });
});