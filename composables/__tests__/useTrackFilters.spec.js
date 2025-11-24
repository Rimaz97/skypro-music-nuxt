import { describe, it, expect } from "vitest";

// Простая функция для тестирования (в реальности это будет из useTrackFilters)
export function filterTracksByAuthor(tracks, author) {
  if (!author) return tracks;
  return tracks.filter(track => 
    track.author?.toLowerCase().includes(author.toLowerCase())
  );
}

describe("filterTracksByAuthor", () => {
  const mockTracks = [
    { id: 1, name: "Song 1", author: "Artist A" },
    { id: 2, name: "Song 2", author: "Artist B" },
    { id: 3, name: "Song 3", author: "Artist A" },
  ];

  it("фильтрует треки по автору", () => {
    const result = filterTracksByAuthor(mockTracks, "Artist A");
    expect(result).toHaveLength(2);
    expect(result[0].author).toBe("Artist A");
    expect(result[1].author).toBe("Artist A");
  });

  it("возвращает все треки при пустом запросе", () => {
    const result = filterTracksByAuthor(mockTracks, "");
    expect(result).toHaveLength(3);
  });

  it("работает с регистром нечувствительно", () => {
    const result = filterTracksByAuthor(mockTracks, "artist a");
    expect(result).toHaveLength(2);
  });

  it("возвращает пустой массив если нет совпадений", () => {
    const result = filterTracksByAuthor(mockTracks, "Unknown Artist");
    expect(result).toHaveLength(0);
  });
});