import { DataSource } from "./data_source.ts";

/**
 * ItemDriveSchema is a schema of an item drive.
 */
export type ItemDriveSchema = Record<string, unknown>;

export class ItemDrive<TItemDriveSchema extends ItemDriveSchema> {
  public constructor(
    private readonly dataSource: DataSource,
  ) {}

  public setItem<TType extends keyof TItemDriveSchema>(
    type: TType,
    name: string,
    item: TItemDriveSchema[TType],
  ) {
    this.dataSource.setItem(type, name, item);
  }

  public setItems<TType extends keyof TItemDriveSchema>(
    type: TType,
    items: Array<[string, TItemDriveSchema[TType]]>,
  ) {
    this.dataSource.setItems(type, items);
  }

  public getItem<TType extends keyof TItemDriveSchema>(
    type: TType,
    name: string,
  ) {
    return this.dataSource.getItem<TType, TItemDriveSchema[TType]>(
      type,
      name,
    );
  }

  public getItems<TType extends keyof TItemDriveSchema>(
    type: TType,
  ): Array<[string, TItemDriveSchema[TType]]> {
    return this.dataSource.getItems(type) as Array<
      [string, TItemDriveSchema[TType]]
    >;
  }

  public deleteItem<TType extends keyof TItemDriveSchema>(
    type: TType,
    name: string,
  ) {
    this.dataSource.deleteItem(type, name);
  }

  public deleteItems<TType extends keyof TItemDriveSchema>(
    type: TType,
  ) {
    this.dataSource.deleteItems(type);
  }
}
