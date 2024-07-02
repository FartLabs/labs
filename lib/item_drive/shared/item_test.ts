import { assertEquals } from "@std/assert";
import { DEFAULT_ITEM_TYPE, factsFrom, makeItem } from "./item.ts";

Deno.test("makeItem makes an item with default item type", () => {
  const date = new Date(0);
  const item = makeItem({}, DEFAULT_ITEM_TYPE, date);
  assertEquals(item.itemType, DEFAULT_ITEM_TYPE);
});

Deno.test("makeItem makes an item from an itemID and itemType", () => {
  const date = new Date(0);
  const item = makeItem(
    { itemID: "1", itemType: "person" },
    DEFAULT_ITEM_TYPE,
    date,
  );
  assertEquals(item.itemID, "1");
  assertEquals(item.itemType, "person");
});

Deno.test("makeItem makes an item with attributes", () => {
  const date = new Date(0);
  const item = makeItem(
    { attributes: [{ attribute: "name", value: ["Ethan"] }] },
    DEFAULT_ITEM_TYPE,
    date,
  );
  assertEquals(item.attributes.length, 1);
  assertEquals(item.attributes[0].attribute, "name");
  assertEquals(item.attributes[0].value, ["Ethan"]);
  assertEquals(item.attributes[0].timestamp, date.getTime());
});

Deno.test("factsFrom makes facts from an item", () => {
  const date = new Date(0);
  const item = makeItem(
    { itemID: "1", attributes: [{ attribute: "name", value: ["Ethan"] }] },
    DEFAULT_ITEM_TYPE,
    date,
  );
  const facts = factsFrom(item);
  assertEquals(facts.length, 1);
  assertEquals(facts[0].itemID, "1");
  assertEquals(facts[0].itemType, DEFAULT_ITEM_TYPE);
  assertEquals(facts[0].attribute, "name");
  assertEquals(facts[0].value, ["Ethan"]);
  assertEquals(facts[0].timestamp, date.getTime());
});

Deno.test("factsFrom makes facts from an item with multiple attributes", () => {
  const date = new Date(0);
  const item = makeItem(
    {
      itemID: "1",
      attributes: [
        { attribute: "name", value: ["Ethan"] },
        {
          attribute: "birthday",
          type: "date_time",
          value: [new Date("2001-03-24").toISOString()],
        },
      ],
    },
    DEFAULT_ITEM_TYPE,
    date,
  );
  const facts = factsFrom(item);
  assertEquals(facts.length, 2);
  assertEquals(facts[0].itemID, "1");
  assertEquals(facts[0].itemType, DEFAULT_ITEM_TYPE);
  assertEquals(facts[0].attribute, "name");
  assertEquals(facts[0].value, ["Ethan"]);
  assertEquals(facts[0].timestamp, date.getTime());
  assertEquals(facts[1].itemID, "1");
  assertEquals(facts[1].itemType, DEFAULT_ITEM_TYPE);
  assertEquals(facts[1].attribute, "birthday");
  assertEquals(facts[1].value, [new Date("2001-03-24").toISOString()]);
  assertEquals(facts[1].timestamp, date.getTime());
});

Deno.test("factsFrom gets attribute's itemID and itemType from item", () => {
  const date = new Date(0);
  const item = makeItem(
    {
      itemID: "item_1",
      itemType: "person",
      attributes: [
        {
          itemID: "item_2",
          itemType: "note",
          attribute: "name",
          value: ["Note"],
        },
      ],
    },
    DEFAULT_ITEM_TYPE,
    date,
  );
  const facts = factsFrom(item);
  assertEquals(facts.length, 1);
  assertEquals(facts[0].itemID, "item_1");
  assertEquals(facts[0].itemType, "person");
  assertEquals(facts[0].attribute, "name");
  assertEquals(facts[0].value, ["Note"]);
});
