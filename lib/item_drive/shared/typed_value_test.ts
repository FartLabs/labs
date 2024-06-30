import { /* assertEquals, */ assertThrows } from "@std/assert";
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

Deno.test("makeTypedValue throws if value and numericalValue have different lengths", () => {
  assertThrows(
    () => makeTypedValue({ value: ["0"], numericalValue: [0, 1] }),
    "Value and numericalValue must have the same length",
  );
});
