import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

export class ItemTypeService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ itemType: ItemType }>,
  ) {}
}

/**
 * ItemType is a reference to an item type.
 */
export interface ItemType {
  readonly type: string;
}
