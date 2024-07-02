import { ulid } from "@std/ulid";
import type { Fact, PartialFact } from "./fact.ts";
import { makeFact } from "./fact.ts";

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
  const itemID = partialItem.itemID ?? ulid(date.getTime());
  const itemType = partialItem.itemType ?? defaultItemType;
  const attributes = (partialItem.attributes ?? []).map((partialFact) =>
    makeFact(
      { ...partialFact, itemID, itemType },
      date,
    )
  );
  return { itemID, itemType, attributes };
}

export function factsFrom(
  partialItem: PartialItem,
  date = new Date(),
): Fact[] {
  return partialItem.attributes?.map((partialFact) =>
    makeFact(
      {
        ...partialFact,
        itemID: partialItem.itemID ?? ulid(date.getTime()),
        itemType: partialItem.itemType ?? DEFAULT_ITEM_TYPE,
      },
      date,
    )
  ) ?? [];
}
