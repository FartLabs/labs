import { ulid } from "@std/ulid";
import type { Fact, PartialFact } from "./fact.ts";
import { makeFact } from "./fact.ts";
import type { TypedValue } from "./typed_value.ts";

export type PartialItem =
  & Omit<Partial<Item>, "attributes">
  & { attributes?: PartialFact[] };

export interface Item {
  itemID: string;
  itemType: string;
  attributes: Fact[];
}

export const DEFAULT_ITEM_TYPE = "empty" as const satisfies string;

export function makeItem(
  partialItem: PartialItem,
  defaultItemType: string = DEFAULT_ITEM_TYPE,
  date = new Date(),
): Item {
  return {
    itemID: partialItem.itemID ?? ulid(date.getTime()),
    itemType: partialItem.itemType ?? defaultItemType,
    attributes: (partialItem.attributes ?? [])
      .map((partialFact) => makeFact(partialFact, date)),
  };
}

export function factsFrom(item: Partial<Item>): Partial<Fact>[] {
  if (item.attributes === undefined) {
    return [];
  }

  return Object.entries(item.attributes).map(([attribute, value]) =>
    factFrom(attribute, value, item.itemID)
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
