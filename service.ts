export class ItemDrive<
  T = unknown,
  TItemDriveSchema extends ItemDriveSchema = {},
> {
  public constructor(
    private readonly dataSource: DataSource<T>,
  ) {}

  public getItemType<TType extends keyof TItemDriveSchema>(
    type: TType,
  ): T | undefined {
    return this.dataSource.getItemType(type);
  }

  public getItemTypes(): Array<[string, T]> {
    return this.dataSource.getItemTypes();
  }

  public setItemType<
    TType extends PropertyKey,
    TItem,
  >(
    type: TType,
    schema: TItem,
  ): ItemDrive<T, TItemDriveSchema & { [type in TType]: TItem }>;
  public setItemType<
    TType extends PropertyKey,
    TItem,
  >(
    type: TType,
    schema: T,
  ): ItemDrive<T, TItemDriveSchema & { [type in TType]: TItem }> {
    this.dataSource.setItemType(type, schema as T);
    return this as unknown as ItemDrive<
      T,
      TItemDriveSchema & { [type in TType]: TItem }
    >;
  }

  public setItemTypes<TAdditionalItemDriveSchema extends ItemDriveSchema>(
    schema: { [type in keyof TAdditionalItemDriveSchema]: T },
  ): ItemDrive<T, TItemDriveSchema & TAdditionalItemDriveSchema> {
    for (const [type, typeSchema] of Object.entries(schema)) {
      this.setItemType(type, typeSchema);
    }

    return this as unknown as ItemDrive<
      T,
      TItemDriveSchema & TAdditionalItemDriveSchema
    >;
  }

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
    return this.dataSource.getItems(String(type)) as Array<
      [string, TItemDriveSchema[TType]]
    >;
  }
}

/**
 * ItemStorage is a storage of items.
 */
type ItemStorage = Map<string, Map<string, unknown>>;

/**
 * ItemSchemaStorage is a storage of item schemas.
 */
export type ItemSchemaStorage<T> = Map<string, T>;

/**
 * ItemDriveSchema is a schema of an item drive.
 */
export type ItemDriveSchema = Record<string, unknown>;

/**
 * DataSource is the source of data for an item drive.
 */
export interface DataSource<T> {
  getItemType(type: PropertyKey): T | undefined;
  getItemTypes(): Array<[string, T]>;
  setItemType(type: PropertyKey, schema: T): void;
  setItemTypes(schema: { [type: PropertyKey]: T }): void;

  getItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined;
  getItems<TType extends PropertyKey, TItem>(
    type: TType,
  ): Array<[string, TItem]>;
  setItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ): void;
  setItems<TType extends PropertyKey, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ): void;
}

// TODO: Compose item drives of various data sources e.g. filesystem, database, in-memory, etc.
// Note: Item drives of different data sources must have the same standard schema type to be composed.
export class InMemoryDataSource<T> implements DataSource<T> {
  public constructor(
    private readonly itemStorage: ItemStorage = new Map(),
    private readonly itemSchemaStorage: ItemSchemaStorage<T> = new Map(),
  ) {}

  public getItemType(type: PropertyKey): T | undefined {
    return this.itemSchemaStorage.get(String(type));
  }

  public getItemTypes(): Array<[string, T]> {
    return Array.from(this.itemSchemaStorage.entries()) as Array<[string, T]>;
  }

  public setItemType(type: PropertyKey, schema: T) {
    this.itemSchemaStorage.set(String(type), schema);
  }

  public setItemTypes(schema: { [type: PropertyKey]: T }) {
    for (const [type, typeSchema] of Object.entries(schema)) {
      this.setItemType(type, typeSchema);
    }
  }

  public getItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
  ): TItem | undefined {
    return this.itemStorage.get(String(type))?.get(name) as TItem;
  }

  public getItems<TType extends PropertyKey, TItem>(
    type: TType,
  ): Array<[string, TItem]> {
    return Array.from(
      this.itemStorage.get(String(type))?.entries() ?? [],
    ) as Array<
      [string, TItem]
    >;
  }

  public setItem<TType extends PropertyKey, TItem>(
    type: TType,
    name: string,
    item: TItem,
  ) {
    const items = this.itemStorage.get(String(type)) ?? new Map();
    items.set(name, item);
    this.itemStorage.set(String(type), items);
  }

  public setItems<TType extends PropertyKey, TItem>(
    type: TType,
    items: Array<[string, TItem]>,
  ) {
    const itemMap = new Map(items);
    this.itemStorage.set(String(type), itemMap);
  }
}
