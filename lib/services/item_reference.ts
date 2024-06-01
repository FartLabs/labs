import type { ItemDrive } from "labs/lib/item_drive/mod.ts";
import { ItemType } from "./item_type.ts";

// TODO: Consider dropping Item prefix from ItemReference and ItemType.
// TODO: Consider renaming "reference" to "address".
export class ItemReferenceService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ itemReference: ItemReference }>,
  ) {}
}

export function toItemReferenceName(itemReference: ItemReference): string {
  return `${itemReference.type}.${itemReference.name}`;
}

/**
 * ItemReference is a reference to an item.
 */
export interface ItemReference extends ItemType {
  readonly name: string;
}
