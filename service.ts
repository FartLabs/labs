export class ItemDriveService<
  T extends ItemDriveSchema = {},
> {
  public constructor(
    private readonly schemaStorage: ItemSchemaStorage = new Map(),
    private readonly itemStorage: ItemStorage = new Map(),
  ) {}

  public setItemTypes<TItemDriveSchema extends ItemDriveSchema>(
    schema: TItemDriveSchema,
  ): ItemDriveService<T & TItemDriveSchema> {
    for (const [type, typeSchema] of Object.entries(schema)) {
      this.setItemType(type, typeSchema);
    }

    return this as unknown as ItemDriveService<T & TItemDriveSchema>;
  }

  public setItemType<
    TType extends string,
    TItemSchema extends ItemSchema,
  >(
    type: TType,
    schema: TItemSchema,
  ): ItemDriveService<T & { [type in TType]: TItemSchema }> {
    this.schemaStorage.set(type, schema);
    return this as unknown as ItemDriveService<
      T & { [type in TType]: TItemSchema }
    >;
  }

  public getItemType<TType extends keyof T>(type: TType): T[TType] {
    return this.schemaStorage.get(String(type)) as T[TType];
  }

  public getItemTypes(): Array<[string, ItemSchema]> {
    return Array.from(this.schemaStorage.entries());
  }

  public setItem<TType extends keyof T>(
    type: TType,
    name: string,
    item: ItemOf<T[TType]>,
  ) {
    const items = this.itemStorage.get(String(type)) ?? new Map();
    this.itemStorage.set(
      String(type),
      items.set(name, item),
    );
  }

  public getItem<TType extends keyof T>(
    type: TType,
    name: string,
  ): ItemOf<T[TType]> {
    return this.itemStorage.get(String(type))?.get(name) as ItemOf<T[TType]>;
  }

  public getItems<TType extends keyof T>(
    type: TType,
  ): Map<string, ItemOf<T[TType]>> {
    return this.itemStorage.get(String(type)) as Map<string, ItemOf<T[TType]>>;
  }
}

/**
 * ItemStorage is a storage of items.
 */
type ItemStorage = Map<string, Map<string, Item>>;

/**
 * Item is an item.
 */
type Item = Record<string, unknown>;

/**
 * ItemOf is an item inferred from a schema.
 */
export type ItemOf<TSchema extends ItemSchema = Record<PropertyKey, never>> = {
  [propertyName in keyof TSchema]: PropertyTypeOf<TSchema[propertyName]>;
};

/**
 * ItemSchemaStorage is a storage of item schemas.
 */
export type ItemSchemaStorage = Map<string, ItemSchema>;

/**
 * ItemDriveSchema is a schema of an item drive.
 */
export type ItemDriveSchema = Record<string, ItemSchema>;

/**
 * ItemSchema is a schema of an item.
 */
export type ItemSchema = Record<string, keyof PropertyTypeMap>;

/**
 * PropertyTypeOf converts a schema property type to a TypeScript type.
 */
export type PropertyTypeOf<TPropertyType extends keyof PropertyTypeMap> =
  PropertyTypeMap[TPropertyType];

/**
 * PropertyTypeMap is a map of schema property types to TypeScript types.
 */
export interface PropertyTypeMap {
  string: string;
  number: number;
  boolean: boolean;
  "string[]": string[];
  "number[]": number[];
  "boolean[]": boolean[];
}
