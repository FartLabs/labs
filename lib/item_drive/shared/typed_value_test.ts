import { assertEquals, assertThrows } from "@std/assert";
import {
  check,
  checkNumerical,
  checkNumericalType,
  makeTypedValue,
  // match,
  // toNumericalValue,
  // toValue,
} from "./typed_value.ts";

Deno.test("check returns true for valid boolean", () => {
  assertEquals(check("true", "boolean"), true);
  assertEquals(check("false", "boolean"), true);
});

Deno.test("check returns false for invalid boolean", () => {
  assertEquals(check("not true|false", "boolean"), false);
});

Deno.test("check returns true for valid date_time", () => {
  assertEquals(check("2021-01-01", "date_time"), true);
});

Deno.test("check returns false for invalid date_time", () => {
  assertEquals(check("a", "date_time"), false);
});

Deno.test("check returns true for text", () => {
  assertEquals(check("a", "text"), true);
});

Deno.test("check returns true for item_id", () => {
  assertEquals(check("a", "item_id"), true);
});

Deno.test("checkNumerical returns true for valid number", () => {
  assertEquals(checkNumerical(0, "number"), true);
});

Deno.test("checkNumerical returns false for invalid number", () => {
  assertEquals(checkNumerical(NaN, "number"), false);
});

Deno.test("checkNumerical returns true for valid boolean", () => {
  assertEquals(checkNumerical(0, "boolean"), true);
  assertEquals(checkNumerical(1, "boolean"), true);
});

Deno.test("checkNumerical returns false for invalid boolean", () => {
  assertEquals(checkNumerical(2, "boolean"), false);
});

Deno.test("checkNumerical returns true for date_time", () => {
  assertEquals(checkNumerical(0, "date_time"), true);
});

Deno.test("checkNumerical returns false for non-numerical types", () => {
  assertEquals(checkNumerical(0, "text"), false);
  assertEquals(checkNumerical(0, "item_id"), false);
});

Deno.test("checkNumericalType returns true for numerical types", () => {
  assertEquals(checkNumericalType("number"), true);
  assertEquals(checkNumericalType("date_time"), true);
  assertEquals(checkNumericalType("boolean"), true);
});

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

Deno.test("makeTypedValue throws if type check fails", () => {
  assertThrows(
    () => makeTypedValue({ type: "number", value: ["a"] }),
    "Value check failed: a",
  );
  assertThrows(
    () => makeTypedValue({ type: "boolean", value: ["not true|false"] }),
    "Value check failed: not true|false",
  );
});

Deno.test("makeTypedValue throws if value is undefined for a non-numerical type", () => {
  assertThrows(
    () => makeTypedValue({ type: "text" }),
    "Expected value to be defined for non-numerical type",
  );
});
