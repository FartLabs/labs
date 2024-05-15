export class ItemDrive<
  T = unknown,
  TItemDriveSchema extends ItemDriveSchema<T> = {},
> {
  public constructor(
    private readonly schemaStorage: ItemSchemaStorage<T> = new Map(),
    private readonly itemStorage: ItemStorage = new Map(),
  ) {}

  public setItemTypes<TAdditionalItemDriveSchema extends ItemDriveSchema<T>>(
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

  public setItemType<
    TType extends string,
    TItem,
  >(
    type: TType,
    schema: TItem,
  ): ItemDrive<T, TItemDriveSchema & { [type in TType]: TItem }>;
  public setItemType<
    TType extends string,
    TItem,
  >(
    type: TType,
    schema: T,
  ): ItemDrive<T, TItemDriveSchema & { [type in TType]: TItem }> {
    this.schemaStorage.set(type, schema);
    return this as unknown as ItemDrive<
      T,
      TItemDriveSchema & { [type in TType]: TItem }
    >;
  }

  public getItemType<TType extends keyof TItemDriveSchema>(
    type: TType,
  ): TItemDriveSchema[TType] {
    return this.schemaStorage.get(String(type)) as TItemDriveSchema[TType];
  }

  public getItemTypes(): Array<[string, unknown]> {
    return Array.from(this.schemaStorage.entries());
  }

  public setItem<TType extends keyof TItemDriveSchema>(
    type: TType,
    name: string,
    item: TItemDriveSchema[TType],
  ) {
    const items = this.itemStorage.get(String(type)) ?? new Map();
    this.itemStorage.set(
      String(type),
      items.set(name, item),
    );
  }

  public getItem<TType extends keyof TItemDriveSchema>(
    type: TType,
    name: string,
  ): TItemDriveSchema[TType] {
    return this.itemStorage.get(String(type))?.get(
      name,
    ) as TItemDriveSchema[TType];
  }

  public getItems<TType extends keyof TItemDriveSchema>(
    type: TType,
  ): Map<string, TItemDriveSchema[TType]> {
    return this.itemStorage.get(String(type)) as Map<
      string,
      TItemDriveSchema[TType]
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
export type ItemDriveSchema<T> = Record<string, T>;
