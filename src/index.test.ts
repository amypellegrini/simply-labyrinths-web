import { it, describe, expect } from "vitest";
import main from ".";

describe("index entry", () => {
  it("exists", () => {
    expect(main).toBeDefined();
    expect(main()).toEqual(undefined);
  });
});
