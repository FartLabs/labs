import { InMemoryDataSource, ItemDrive, MultiplexedDataSource } from "./mod.ts";

const personSchema = {
  name: "string",
  age: 0,
} satisfies ItemSchema;

/**
 * ItemSchema is a schema for an item.
 */
type ItemSchema = Record<PropertyKey, unknown>;

//
// To run:
// deno run ./data_source/example.ts
//
if (import.meta.main) {
  const inMemoryDataSource = new InMemoryDataSource();
  const dataSource = new MultiplexedDataSource(
    new Map([
      ["person", inMemoryDataSource],
    ]),
  );
  const service = new ItemDrive<{ person: typeof personSchema }>(dataSource);
  service.setItem(
    "person",
    "alice",
    { name: "Alice", age: 42 },
  );
  const item = service.getItem("person", "alice");
  console.log({ item });
}

//
// TODO:
// - Associate item types with actions in a system.
// - Associate this service with other services e.g. higher-order service management, ui rendering, etc.
//
