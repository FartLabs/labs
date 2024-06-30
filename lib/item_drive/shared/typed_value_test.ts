import { assertEquals, assertThrows } from "@std/assert";
import { makeTypedValue } from "./typed_value.ts";

Deno.test("makeTypedValue throws if both value and numericalValue are undefined", () => {
  assertThrows(
    () => makeTypedValue({}),
    "At least one of value or numericalValue is required",
  );
});

Deno.test("makeTypedValue throws if numericalValue is defined for a non-numerical type", () => {
  assertThrows(
    () => makeTypedValue({ type: "text", numericalValue: [0] }),
    "Numerical value is not allowed for type string",
  );
});

Deno.test("makeTypedValue throws if repeatable is false and the lengths of value and numericalValue !== 1", () => {
  assertThrows(() => makeTypedValue({ value: [] }));
  assertThrows(() => makeTypedValue({ value: ["a", "b"] }));
});

Deno.test("makeTypedValue makes a typed value with multiple values if repeatable is true", () => {
  const typedValue = makeTypedValue({
    value: ["a", "b"],
    repeatable: true,
  });
  assertEquals(typedValue.value, ["a", "b"]);
});

Deno.test("makeTypedValue throws if value and numericalValue have different lengths", () => {
  assertThrows(
    () =>
      makeTypedValue({
        value: ["0"],
        numericalValue: [0, 1],
        repeatable: true,
      }),
    "Value and numericalValue must have the same length",
  );
});

Deno.test("makeTypedValue throws if value and numericalValue check fails", () => {
  assertThrows(
    () =>
      makeTypedValue({
        type: "number",
        value: ["0"],
        numericalValue: [1],
      }),
    "Value and numericalValue check failed: 0 !== 1",
  );
});

Deno.test("makeTypedValue throws if value check fails", () => {
  assertThrows(
    () => makeTypedValue({ type: "number", value: ["a"] }),
    "Value check failed: a",
  );
  assertThrows(
    () => makeTypedValue({ type: "number", value: ["a"] }),
    "Value check failed: a",
  );
});
