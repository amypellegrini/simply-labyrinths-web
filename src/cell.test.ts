import { describe, it, expect } from "vitest";
import Cell from "./cell";

describe("cell", () => {
  it("can be created with row and column", () => {
    const cell = new Cell(0, 1);

    expect(cell).toBeDefined();
    expect(cell.row).toEqual(0);
    expect(cell.column).toEqual(1);
  });

  it("keeps track of neighbour cells", () => {
    const cell = new Cell(0, 1);
    expect(cell.links).toBeDefined();
  });

  it("has a method to link neighbour cells", () => {
    const cellOne = new Cell(0, 1);
    const cellTwo = new Cell(1, 1);

    cellOne.link(cellTwo);

    expect(cellOne.links.has(cellTwo.id)).toBeTruthy();
    expect(cellTwo.links.has(cellOne.id)).toBeFalsy();
  });

  it("cell link can be bidirectional", () => {
    const cellOne = new Cell(0, 1);
    const cellTwo = new Cell(1, 1);

    cellOne.link(cellTwo, true);

    expect(cellOne.links.get(cellTwo.id)?.bidi).toBeTruthy();
    expect(cellTwo.links.get(cellOne.id)?.bidi).toBeTruthy();
  });

  it("has a method to unlink neighbour cells", () => {
    const cellOne = new Cell(0, 1);
    const cellTwo = new Cell(1, 1);

    cellOne.link(cellTwo, true);
    expect(cellOne.links.has(cellTwo.id)).toBeTruthy();

    cellOne.unlink(cellTwo);
    expect(cellOne.links.has(cellTwo.id)).toBeFalsy();
    expect(cellTwo.links.has(cellOne.id)).toBeFalsy();
  });

  it("has a method to check if another cell is linked", () => {
    const cellOne = new Cell(0, 1);
    const cellTwo = new Cell(1, 1);
    const cellThree = new Cell(1, 0);

    cellOne.link(cellTwo, true);

    expect(cellOne.linked(cellTwo)).toBeTruthy();
    expect(cellOne.linked(cellThree)).toBeFalsy();
  });

  it("has a method to query all neighbours", () => {
    const cell = new Cell(1, 1);

    cell.north = new Cell(1, 2);
    cell.south = new Cell(1, 0);
    cell.east = new Cell(2, 1);

    expect(cell.neighbours()).toEqual([cell.north, cell.south, cell.east]);
  });
});
