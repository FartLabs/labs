import { assertEquals } from "@std/assert";
import type { ListItem } from "./list.ts";
import { collapseItem, collapseItems, collapseSum } from "./list.ts";

Deno.test("collapseItem collapses an item", () => {
  const expected = [{ name: "test", type: "test", quantity: 3 }];
  const actual: ListItem[] = [];
  collapseItem(
    actual,
    { name: "test", type: "test" },
    collapseSum,
  );
  collapseItem(
    actual,
    { name: "test", type: "test" },
    collapseSum,
    0,
  );
  collapseItem(
    actual,
    { name: "test", type: "test" },
    collapseSum,
    0,
  );
  assertEquals(actual, expected);
});

Deno.test("collapseItems collapses items", () => {
  const expected = [{ name: "test", type: "test", quantity: 3 }];
  const actual = collapseItems(
    [],
    [
      { name: "test", type: "test" },
      { name: "test", type: "test" },
      { name: "test", type: "test" },
    ],
    collapseSum,
  );
  assertEquals(actual, expected);
});
