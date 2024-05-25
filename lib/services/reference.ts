import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

export class ReferenceService<
  TReferenceServiceSchema extends ReferenceServiceSchema,
> {
  public constructor(
    public readonly itemDrive: ItemDrive<{ reference: Reference }>,
  ) {}

  public addReference(props: { name: string; item: Reference }): void {
    this.itemDrive.setItem("reference", props.name, props.item);
  }
}

export interface ReferenceServiceSchema {
  [reference: string]: string;
}

// TODO: Do reference items need to be stored in a separate item drive?

/**
 * ReferenceItem is a reference to an item.
 */
export interface ReferenceItem extends Reference {
  readonly name: string;
}

// TODO: Add JSON schema for reference items.

/**
 * Reference is a reference to an item type.
 */
export interface Reference {
  readonly type: string;
}
