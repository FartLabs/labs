export class ItemDriveService {
  public constructor(
    private readonly schemaStorage: ItemSchemaStorage = new Map(),
    private readonly itemStorage: ItemStorage = new Map(),
  ) {}

  public setItemType(type: string, schema: ItemSchema) {
    this.schemaStorage.set(type, schema);
  }

  public getItemType(type: string) {
    return this.schemaStorage.get(type);
  }

  public setItem(type: string, name: string, item: Item) {
    this.itemStorage.set(ItemDriveService.itemKey(type, name), item);
  }

  public getItem(type: string, name: string) {
    return this.itemStorage.get(ItemDriveService.itemKey(type, name));
  }

  public static itemKey(type: string, name: string) {
    return `${type}:${name}`;
  }

  static example() {
    const service = new ItemDriveService();
    service.setItemType("person", { name: "string", age: "number" });
    service.setItem("person", "alice", { name: "Alice", age: 42 });
    const item = service.getItem("person", "alice");
    console.log({ item });
  }
}

/**
 * ItemStorage is a storage of items.
 */
type ItemStorage = Map<string, Item>;

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
