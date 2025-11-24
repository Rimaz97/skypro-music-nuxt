import { describe, it, expect } from "vitest";
import { formatDuration } from "./formatDuration";

describe("formatDuration", () => {
  it("форматирует секунды в mm:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(5)).toBe("0:05");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
    expect(formatDuration(3599)).toBe("59:59");
  });

  it("возвращает пустую строку для некорректных значений", () => {
    expect(formatDuration()).toBe("");
    expect(formatDuration(-1)).toBe("");
    expect(formatDuration("abc")).toBe("");
    expect(formatDuration(NaN)).toBe("");
    expect(formatDuration(null)).toBe("");
  });
});