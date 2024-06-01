import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * EmptyService provides a service for managing empty items.
 */
export class EmptyService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ empty: Empty }>,
  ) {}

  public set(props: { name: string; title?: string }): void {
    this.itemDrive.setItem("empty", props.name, {
      name: props.name,
      title: props.title,
    });
  }

  public delete(props: { name: string }): void {
    this.itemDrive.deleteItem("empty", props.name);
  }
}

/**
 * Empty is an empty item.
 *
 * Empty acts as a placeholder for an undeclared item type.
 */
export interface Empty {
  readonly name: string;
  readonly title?: string;
}
