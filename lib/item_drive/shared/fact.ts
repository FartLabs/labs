import { ulid } from "@std/ulid";
import type { TypedValue, TypedValueType } from "./typed_value.ts";
import { toNumericalValue, toValue } from "./typed_value.ts";
import { DEFAULT_ITEM_TYPE } from "./item.ts";

export type PartialFact = Partial<Fact>;

export interface Fact extends TypedValue {
  factID: string;
  itemID: string;
  itemType: string;
  attribute: string;
  timestamp: number;
  discarded: boolean;
}

export const DEFAULT_FACT_TYPE = "text" as const satisfies TypedValueType;

export function makeFact(fact: Partial<Fact>, date = new Date()): Fact {
  if (fact.attribute === undefined) {
    throw new Error("Attribute is required");
  }

  if (fact.value === undefined && fact.numericalValue === undefined) {
    throw new Error("One of value or numericalValue is required");
  }

  const timestamp = fact.timestamp ?? date.getTime();
  const factID = fact.factID ?? ulid(timestamp);
  const itemID = fact.itemID ?? ulid(timestamp);
  const itemType = fact.itemType ?? DEFAULT_ITEM_TYPE;
  const type = fact.type ?? DEFAULT_FACT_TYPE;
  let value = fact.value ?? fact.numericalValue?.map((n) => toValue(n, type));
  const numericalValue = fact.numericalValue ??
    fact.value?.map((v) => {
      const n = toNumericalValue(v, type);
      if (n === undefined) {
        throw new Error(`Invalid value for type ${type}: ${v}`);
      }

      return n;
    });

  if (value === undefined) {
    value = numericalValue?.map((n) => toValue(n, type));
  }

  return {
    factID,
    itemID,
    itemType,
    timestamp,
    type,
    value: value as string[],
    numericalValue,
    attribute: fact.attribute,
    discarded: fact.discarded ?? false,
  };
}
