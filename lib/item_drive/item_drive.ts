import { DataSource } from "../data_source/mod.ts";

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
    this.dataSource.setItem(type.toString(), name, item);
  }

  public setItems<TType extends keyof TItemDriveSchema>(
    type: TType,
    items: Array<[string, TItemDriveSchema[TType]]>,
  ) {
    this.dataSource.setItems(type.toString(), items);
  }

  public getItem<TType extends keyof TItemDriveSchema>(
    type: TType,
    name: string,
  ) {
    return this.dataSource.getItem<string, TItemDriveSchema[TType]>(
      type.toString(),
      name,
    );
  }

  public getItems<TType extends keyof TItemDriveSchema>(
    type: TType,
  ): Array<[string, TItemDriveSchema[TType]]> {
    return this.dataSource.getItems(type.toString());
  }

  public deleteItem<TType extends keyof TItemDriveSchema>(
    type: TType,
    name: string,
  ) {
    this.dataSource.deleteItem(type.toString(), name);
  }

  public deleteItems<TType extends keyof TItemDriveSchema>(
    type: TType,
  ) {
    this.dataSource.deleteItems(type.toString());
  }
}
