import { DataSource } from "../data_source/mod.ts";

/**
 * ItemDriveSchema is a schema of an item drive.
 */
export type ItemDriveSchema = Record<string, unknown>;

// TODO: Create special item drive implementation for automatically updating properties of specific items such as created_at, updated_at, deleted_at, etc. Or common building blocks for items such as counters, etc.

export class ItemDrive<TItemDriveSchema extends ItemDriveSchema> {
  public constructor(private readonly dataSource: DataSource) {}

  public async setItem<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    name: string,
    item: TItemDriveSchema[TCollection],
  ) {
    await this.dataSource.setItem(collection.toString(), name, item);
  }

  public async setItems<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    items: Array<[string, TItemDriveSchema[TCollection]]>,
  ) {
    await this.dataSource.setItems(collection.toString(), items);
  }

  public getItem<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    name: string,
  ) {
    return this.dataSource.getItem<string, TItemDriveSchema[TCollection]>(
      collection.toString(),
      name,
    );
  }

  public getItems<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
  ) {
    return this.dataSource.getItems<string, TItemDriveSchema[TCollection]>(
      collection.toString(),
    );
  }

  public deleteItem<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
    name: string,
  ) {
    this.dataSource.deleteItem(collection.toString(), name);
  }

  public deleteItems<TCollection extends keyof TItemDriveSchema>(
    collection: TCollection,
  ) {
    this.dataSource.deleteItems(collection.toString());
  }
}
