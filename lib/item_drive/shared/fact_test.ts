import { assertEquals, assertThrows } from "@std/assert";
import { checkFact, makeFact } from "./fact.ts";

Deno.test("makeFact throws error if attribute is missing", () => {
  assertThrows(() => makeFact({ value: ["Ethan"] }));
});

Deno.test("makeFact makes a fact from an attribute and value", () => {
  const date = new Date(0);
  const fact = makeFact({ attribute: "name", value: ["Ethan"] }, date);
  assertEquals(fact.attribute, "name");
  assertEquals(fact.value, ["Ethan"]);
  assertEquals(fact.timestamp, date.getTime());
});

Deno.test("checkFact returns true if fact matches query by attribute", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  const query = { attributes: [{ attribute: "name" }] };
  assertEquals(checkFact(fact, query), true);
});

Deno.test("checkFact returns false if fact does not match query by attribute", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  const query = { attributes: [{ attribute: "age" }] };
  assertEquals(checkFact(fact, query), false);
});

Deno.test("checkFact returns true if fact matches query by value", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  const query = {
    attributes: [{ attribute: "name", valueIncludes: ["Ethan"] }],
  };
  assertEquals(checkFact(fact, query), true);
});

Deno.test("checkFact returns false if fact does not match query by value", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  const query = {
    attributes: [{ attribute: "name", valueIncludes: ["Not Ethan"] }],
  };
  assertEquals(checkFact(fact, query), false);
});

Deno.test("checkFact returns true if fact matches query by multiple values", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  const query = {
    attributes: [{ attribute: "name", valueIncludes: ["Ethan", "Not Ethan"] }],
  };
  assertEquals(checkFact(fact, query), true);
});
