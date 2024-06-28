import { ulid } from "@std/ulid";
import type { TypedValue } from "./typed_value.ts";
import { makeTypedValue } from "./typed_value.ts";
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

export function makeFact(fact: PartialFact, date = new Date()): Fact {
  if (fact.attribute === undefined) {
    throw new Error("Attribute is required");
  }

  const timestamp = fact.timestamp ?? date.getTime();
  return {
    ...makeTypedValue(fact),
    timestamp,
    attribute: fact.attribute,
    factID: fact.factID ?? ulid(timestamp),
    itemID: fact.itemID ?? ulid(timestamp),
    itemType: fact.itemType ?? DEFAULT_ITEM_TYPE,
    discarded: fact.discarded ?? false,
  };
}
