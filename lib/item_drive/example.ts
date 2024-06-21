import { InMemoryDataSource } from "./in_memory_data_source.ts";
import { ItemDrive } from "./item_drive.ts";

// deno run -A lib/item_drive/example.ts
if (import.meta.main) {
  const dataSource = new InMemoryDataSource();
  const itemDrive = new ItemDrive(dataSource);
  itemDrive.insertItem({
    itemType: "person",
    attributes: {
      // Might as well be a list of partial facts, right?
      name: {
        attribute: "name",
        value: "Alice",
        factID: "",
        itemID: "",
        itemType: "",
        discarded: false,
        type: "number",
      },
    },
  });
}
