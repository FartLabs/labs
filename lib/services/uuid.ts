import type { ItemDrive } from "labs/lib/item_drive/mod.ts";

/**
 * UUIDService provides a service for managing UUIDs.
 */
export class UUIDService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ uuid: UUID }>,
  ) {}

  public set(props: { name: string; uuid?: string }): void {
    const existingUUID = this.get({ name: props.name });
    if (existingUUID !== undefined) {
      throw new Error(`UUID already exists for name: ${props.name}`);
    }

    const uuid = props.uuid ?? crypto.randomUUID();
    this.itemDrive.setItem("uuid", props.name, { uuid });
  }

  public get(props: { name: string }): UUID | undefined {
    return this.itemDrive.getItem("uuid", props.name);
  }

  public delete(props: { name: string }): void {
    this.itemDrive.deleteItem("uuid", props.name);
  }
}

/**
 * UUID represents a universally unique identifier.
 */
export interface UUID {
  readonly uuid: string;
}
