import {
  FSDataSource,
  InMemoryDataSource,
  ItemDrive,
  MultiplexedDataSource,
  SynchronizedDataSource,
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

/**
 * NotesService is a service for managing notes.
 */
export class NotesService {
  public constructor(
    public readonly itemDrive: ItemDrive<{ note: typeof noteSchema }>,
    // Import other services...
  ) {}

  // Expose methods for managing notes...
}

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
  const synchronizedDataSource = new SynchronizedDataSource([
    inMemoryDataSource,
    fsDataSource,
  ]);
  const dataSource = MultiplexedDataSource.fromDataSources([
    ["person", synchronizedDataSource],
    ["note", synchronizedDataSource],
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

  const notesService = new NotesService(itemDrive);
  notesService.itemDrive.setItem("note", "alice", { text: "Hello, world!" });
  const note = notesService.itemDrive.getItem("note", "alice");
  console.log({ note });
}

//
// TODO:
// - Associate item types with actions in a system.
// - Associate this service with other services e.g. higher-order service management, ui rendering, etc.
//
