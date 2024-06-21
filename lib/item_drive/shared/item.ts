import { ulid } from "@std/ulid";
import type { Fact } from "./fact.ts";

export interface Item {
  itemID: string;
  type: string;
  attributes: Record<string, Fact>;
}

export const DEFAULT_ITEM_TYPE = "empty" as const satisfies string;

export function makeItem(
  partialItem: Partial<Item>,
  defaultItemType: string = DEFAULT_ITEM_TYPE,
  date = new Date(),
): Item {
  return {
    itemID: partialItem.itemID ?? ulid(date.getTime()),
    type: partialItem.type ?? defaultItemType,
    attributes: partialItem.attributes ?? {},
  };
}
