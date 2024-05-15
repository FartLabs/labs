import {
  FSDataSource,
  InMemoryDataSource,
  ItemDrive,
  MultiplexedDataSource,
} from "./mod.ts";

const personSchema = {
  name: "string",
  age: 0,
} satisfies ItemSchema;

const noteSchema = {
  text: "string",
} satisfies ItemSchema;

/**
 * ItemSchema is a schema for an item.
 */
type ItemSchema = Record<PropertyKey, unknown>;

//
// To run:
// deno run -A ./data_source/example.ts
//
if (import.meta.main) {
  const inMemoryDataSource = new InMemoryDataSource();
  const fsDataSource = new FSDataSource(
    (type: string, name?: string) => `./${type}${name ? `/${name}.json` : ""}`,
    { text: (item) => JSON.stringify(item, null, 2) + "\n" },
    { text: (item) => JSON.parse(item) },
  );
  const dataSource = MultiplexedDataSource.fromDataSources([
    ["person", inMemoryDataSource],
    ["note", fsDataSource],
  ]);
  const itemDrive = new ItemDrive<{
    person: typeof personSchema;
    note: typeof noteSchema;
  }>(dataSource);

  itemDrive.setItem(
    "person",
    "alice",
    { name: "Alice", age: 42 },
  );
  const item = itemDrive.getItem("person", "alice");
  console.log({ item });

  itemDrive.setItem("note", "alice", { text: "Hello, world!" });
  const note = itemDrive.getItem("note", "alice");
  console.log({ note });
}

//
// TODO:
// - Associate item types with actions in a system.
// - Associate this service with other services e.g. higher-order service management, ui rendering, etc.
//
