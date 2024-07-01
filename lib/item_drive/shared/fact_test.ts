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

Deno.test("checkFact returns true if fact matches query by itemID and factID", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(checkFact(fact, { itemID: [fact.itemID] }), true);
  assertEquals(checkFact(fact, { factID: [fact.factID] }), true);
});

Deno.test("checkFact returns false if fact does not match query by itemID and factID", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(checkFact(fact, { itemID: ["Not Ethan"] }), false);
  assertEquals(checkFact(fact, { factID: ["Not Ethan"] }), false);
});

Deno.test("checkFact returns false if fact does not match query by factID", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(checkFact(fact, { factID: ["Not Ethan"] }), false);
});

Deno.test("checkFact returns true if fact matches query by attribute", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(checkFact(fact, { attributes: [{ attribute: "name" }] }), true);
});

Deno.test("checkFact returns false if fact does not match query by attribute", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(
    checkFact(
      fact,
      { attributes: [{ attribute: "age" }] },
    ),
    false,
  );
});

Deno.test("checkFact returns true if fact matches query by value", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(
    checkFact(
      fact,
      { attributes: [{ attribute: "name", valueIncludes: ["Ethan"] }] },
    ),
    true,
  );
});

Deno.test("checkFact returns false if fact does not match query by value", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(
    checkFact(
      fact,
      { attributes: [{ attribute: "name", valueIncludes: ["Not Ethan"] }] },
    ),
    false,
  );
});

Deno.test("checkFact returns true if fact matches query by valueIncludes", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "name",
          valueIncludes: ["Ethan", "Not Ethan"],
        }],
      },
    ),
    true,
  );
});

Deno.test("checkFact returns false if fact does not match query by valueIncludes", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(
    checkFact(
      fact,
      { attributes: [{ attribute: "name", valueIncludes: ["Not Ethan"] }] },
    ),
    false,
  );
});

Deno.test("checkFact returns true if fact matches query by numericalValueIncludes", () => {
  const fact = makeFact({
    attribute: "age",
    type: "number",
    numericalValue: [10],
  });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "age",
          numericalValueIncludes: [10],
        }],
      },
    ),
    true,
  );
});

Deno.test("checkFact returns false if fact does not match query by numericalValueIncludes", () => {
  const fact = makeFact({
    attribute: "age",
    type: "number",
    numericalValue: [10],
  });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "age",
          numericalValueIncludes: [11],
        }],
      },
    ),
    false,
  );
});

Deno.test("checkFact returns true if fact matches query by numericalValueIncludesAtOrAbove", () => {
  const fact = makeFact({
    attribute: "age",
    type: "number",
    numericalValue: [10],
  });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "age",
          numericalValueIncludesAtOrAbove: 10,
        }],
      },
    ),
    true,
  );
});

Deno.test("checkFact returns false if fact does not match query by numericalValueIncludesAtOrAbove", () => {
  const fact = makeFact({
    attribute: "age",
    type: "number",
    numericalValue: [10],
  });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "age",
          numericalValueIncludesAtOrAbove: 11,
        }],
      },
    ),
    false,
  );
});

Deno.test("checkFact returns true if fact matches query by numericalValueIncludesAtOrBelow", () => {
  const fact = makeFact({
    attribute: "age",
    type: "number",
    numericalValue: [10],
  });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "age",
          numericalValueIncludesAtOrBelow: 10,
        }],
      },
    ),
    true,
  );
});

Deno.test("checkFact returns false if fact does not match query by numericalValueIncludesAtOrBelow", () => {
  const fact = makeFact({
    attribute: "age",
    type: "number",
    numericalValue: [10],
  });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "age",
          numericalValueIncludesAtOrBelow: 9,
        }],
      },
    ),
    false,
  );
});

Deno.test("checkFact returns true if fact matches query by createdAtOrAfter", () => {
  const date = new Date(0);
  const fact = makeFact({ attribute: "name", value: ["Ethan"] }, date);
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "name",
          createdAtOrAfter: date.getTime(),
        }],
      },
    ),
    true,
  );
});

Deno.test("checkFact returns false if fact does not match query by createdAtOrAfter", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "name",
          createdAtOrAfter: fact.timestamp + 1,
        }],
      },
    ),
    false,
  );
});

Deno.test("checkFact returns true if fact matches query by createdAtOrBefore", () => {
  const date = new Date(0);
  const fact = makeFact({ attribute: "name", value: ["Ethan"] }, date);
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "name",
          createdAtOrBefore: date.getTime(),
        }],
      },
    ),
    true,
  );
});

Deno.test("checkFact returns false if fact does not match query by createdAtOrBefore", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(
    checkFact(
      fact,
      {
        attributes: [{
          attribute: "name",
          createdAtOrBefore: fact.timestamp - 1,
        }],
      },
    ),
    false,
  );
});
