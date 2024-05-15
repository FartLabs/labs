import { ItemDriveService } from "./service.ts";

type PersonItem = ItemOf<typeof personSchema>;

const personSchema = {
  name: "string",
  age: "number",
} as const satisfies ItemSchema;

//
// Run:
// deno run service_example.ts
//
if (import.meta.main) {
  const service = new ItemDriveService<ItemSchema>()
    .setItemType<"person", ItemSchema, PersonItem>(
      "person",
      personSchema,
    );
  service.setItem(
    "person",
    "alice",
    { name: "Alice", age: 42 },
  );
  const item = service.getItem("person", "alice");
  console.log({ item });
}

/**
 * ItemOf is an item inferred from a schema.
 */
export type ItemOf<TSchema extends ItemSchema> = {
  [propertyName in keyof TSchema]: PropertyTypeOf<TSchema[propertyName]>;
};

/**
 * ItemDriveService is a service for managing items.
 */
export type ItemDriveSchema = Record<PropertyKey, ItemSchema>;

/**
 * ItemSchema is a schema for an item.
 */
// deno-lint-ignore no-explicit-any
export type ItemSchema = Record<PropertyKey, any>;

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

//
// TODO:
// - Associate item types with actions in a system.
// - Associate this service with other services e.g. higher-order service management, ui rendering, etc.
//
