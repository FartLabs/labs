import { ItemDrive } from "./service.ts";

const personSchema = {
  name: "string",
  age: 0,
} satisfies ItemSchema;

if (import.meta.main) {
  const service = new ItemDrive()
    .setItemType("person", personSchema);
  service.setItem(
    "person",
    "alice",
    { name: "Alice", age: 42 },
  );
  const item = service.getItem("person", "alice");
  console.log({ item });
}

/**
 * ItemSchema is a schema for an item.
 */
type ItemSchema = Record<PropertyKey, unknown>;

//
// TODO:
// - Associate item types with actions in a system.
// - Associate this service with other services e.g. higher-order service management, ui rendering, etc.
//
