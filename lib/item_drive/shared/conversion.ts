import type { Item } from "./item.ts";
import type { Fact } from "./fact.ts";
import type { TypedValue } from "./typed_value.ts";

export function factsFrom(item: Partial<Item>): Partial<Fact>[] {
  if (item.attributes === undefined) {
    return [];
  }

  return Object.entries(item.attributes).map(([attribute, value]) =>
    factFrom(attribute, value, item)
  );
}

export function factFrom(
  attribute: string,
  value: TypedValue,
  itemID?: string,
): Partial<Fact> {
  return {
    attribute,
    itemID,
    value: value.value,
    numericalValue: value.numericalValue,
    type: value.type,
    discarded: false,
  };
}
