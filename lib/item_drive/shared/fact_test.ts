import { assertEquals, assertThrows } from "@std/assert";
import { makeFact } from "./fact.ts";

Deno.test("makeFact makes a fact from an attribute and value", () => {
  const fact = makeFact({ attribute: "name", value: ["Ethan"] });
  assertEquals(fact.attribute, "name");
  assertEquals(fact.value, ["Ethan"]);
});

// TODO: Write a list of tests for the typed_value module.

Deno.test("makeFact makes a fact from an attribute and numerical value", () => {
  const fact = makeFact({
    attribute: "age",
    type: "number",
    numericalValue: [10],
  });
  assertEquals(fact.attribute, "age");
  assertEquals(fact.numericalValue, [10]);
});

Deno.test("makeFact throws if a non-numerical fact has numericalValue", () => {
  const fact = makeFact({
    attribute: "age",
    numericalValue: [10],
  });
  assertEquals(fact.attribute, "age");
  assertEquals(fact.numericalValue, [10]);
});

Deno.test("makeFact throws if multiple values are provided without setting repeatable to true", () => {
  assertThrows(() => {
    makeFact({ attribute: "name", value: ["Ethan", "Ash"] });
  });
});

Deno.test("makeFact makes a fact with multiple values if repeatable is true", () => {
  const fact = makeFact({
    attribute: "name",
    value: ["Ethan", "Ash"],
    repeatable: true,
  });
  assertEquals(fact.attribute, "name");
  assertEquals(fact.value, ["Ethan", "Ash"]);
});

Deno.test("makeFact throws if values mismatch the numericalValues", () => {
  assertThrows(() => {
    makeFact({ attribute: "age", value: ["Ash"], numericalValue: [10] });
  });
});

Deno.test("makeFact infers the values of a numerical fact from given values", () => {
  const fact = makeFact({
    attribute: "age",
    numericalValue: [10],
    type: "number",
  });
  assertEquals(fact.attribute, "age");
  assertEquals(fact.numericalValue, [10]);
  assertEquals(fact.value, ["10"]);
});

// TODO: Write a list of tests for the makeFact function.
