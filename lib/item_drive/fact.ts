import { ulid } from "@std/ulid";
import type { TypedValueType } from "./typed_value.ts";
import { toNumericalValue, toValue } from "./typed_value.ts";

export interface Fact {
  factID: string;
  itemID: string;
  attribute: string;
  value: string;
  numericalValue?: number;
  type: TypedValueType;
  timestamp: Date;
  discarded: boolean;
}

export const DEFAULT_FACT_TYPE = "text" satisfies TypedValueType;

export function makeFact(fact: Partial<Fact>): Fact {
  if (fact.attribute === undefined) {
    throw new Error("Attribute is required");
  }

  if (fact.value === undefined && fact.numericalValue === undefined) {
    throw new Error("One of value or numericalValue is required");
  }

  const timestamp = fact.timestamp ?? new Date();
  const factID = fact.factID ?? ulid(timestamp.getTime());
  const itemID = fact.itemID ?? ulid(timestamp.getTime());
  const type = fact.type ?? DEFAULT_FACT_TYPE;
  const value = fact.value ?? toValue(fact.numericalValue, type);
  const numericalValue = fact.numericalValue ?? toNumericalValue(value, type);
  return {
    factID,
    itemID,
    timestamp,
    type,
    value,
    numericalValue,
    attribute: fact.attribute,
    discarded: fact.discarded ?? false,
  };
}
